import os
import json
from datetime import datetime
from io import BytesIO
from flask import Flask, request, send_file, jsonify
from fpdf import FPDF
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Configurar Firebase BBDD (Cotizador PWA)
db = None

def init_firebase():
    global db
    if not firebase_admin._apps:
        try:
            # 1. Tratar ambiente Vercel
            cred_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
            if cred_json:
                cred = credentials.Certificate(json.loads(cred_json))
            else:
                # 2. Local fallback
                cred_path = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
                cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Error init firebase: {e}")
    if db is None and len(firebase_admin._apps) > 0:
        db = firestore.client()

class CotizacionPDF(FPDF):
    def header(self):
        # Arial bold 15
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(232, 115, 12) # Naranja Brand
        self.cell(0, 10, 'INNOVATECH', 0, 1, 'L')
        self.set_font('Helvetica', '', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, 'Calidad que se ve, seguridad que se siente.', 0, 1, 'L')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

def get_item_price(product_name, fallback):
    """Obtiene el precio exacto de un item MINVU APU o similar en la DB"""
    init_firebase()
    if not db:
        return fallback
    try:
        # Buscar por nombre exacto en la colección
        docs = db.collection('products').where('producto', '==', product_name).limit(1).stream()
        for d in docs:
            data = d.to_dict()
            return float(data.get('precio_unitario_neto', fallback))
        return fallback
    except Exception as e:
        print(f"Error fetching {product_name}: {e}")
        return fallback

# Definición de Recetas Profesionales (APU Simplificado)
# Las llaves son los nombres de productos existentes en la coleccion 'products' (proveedor 'MINVU APU')
RECETAS = {
    "Remodelaciones": [
        {"item": "Tabique Metalcon 70mm + volcanita 10mm dos caras", "ratio": 1.0, "unidad": "m²", "fallback": 38500},
        {"item": "Pintura látex interior 2 manos", "ratio": 1.0, "unidad": "m²", "fallback": 5200},
        {"item": "Porcelanato 60x60 rectificado, clase 4", "ratio": 1.0, "unidad": "m²", "fallback": 48000}
    ],
    "Obra Gruesa": [
        {"item": "Radier H-15 e=10cm, con malla electrosoldada", "ratio": 1.0, "unidad": "m²", "fallback": 28500},
        {"item": "Excavación manual fundaciones", "ratio": 0.2, "unidad": "m³", "fallback": 8400},
        {"item": "Hormigón HA para muro H-25", "ratio": 0.15, "unidad": "m³", "fallback": 168000}
    ],
    "Terminaciones": [
        {"item": "Cerámica de piso 40x40", "ratio": 1.0, "unidad": "m²", "fallback": 32000},
        {"item": "Pintura acrílica exterior 2 manos", "ratio": 1.0, "unidad": "m²", "fallback": 7800},
        {"item": "Puerta interior madera HDF 0.8x2.1m (incl. marco)", "ratio": 0.05, "unidad": "un", "fallback": 95000}
    ],
    "Instalaciones": [
        {"item": "Circuito enchufe 16A (cable + ducto)", "ratio": 0.2, "unidad": "un", "fallback": 52000},
        {"item": "Red interior agua fría cobre 15mm (c/conexión)", "ratio": 0.5, "unidad": "ml", "fallback": 4200},
        {"item": "Enchufe doble empotrar con tierra", "ratio": 0.3, "unidad": "un", "fallback": 5200}
    ]
}

@app.route('/api/cotizar', methods=['POST'])
def cotizar():
    try:
        data = request.json or {}
        servicio_raw = data.get('service', 'Remodelaciones')
        area = float(data.get('area', 1))
        nombre = data.get('name', 'Cliente Valioso')
        comuna = data.get('comuna', 'Santiago')

        # Determinar receta
        receta_id = "Remodelaciones"
        for k in RECETAS.keys():
            if k.lower() in servicio_raw.lower():
                receta_id = k
                break
        
        items_calculados = []
        subtotal_items = 0

        for r in RECETAS[receta_id]:
            precio_db = get_item_price(r['item'], r['fallback'])
            costo_partida = precio_db * r['ratio'] * area
            items_calculados.append({
                "nombre": r['item'],
                "unitario": precio_db,
                "cantidad": round(r['ratio'] * area, 2),
                "unidad": r['unidad'],
                "total": costo_partida
            })
            subtotal_items += costo_partida

        # Otros costos: Mano de Obra (30% sobre materiales) y Margen (20%)
        mano_obra = subtotal_items * 0.40
        gastos_generales = (subtotal_items + mano_obra) * 0.15
        utilidad = (subtotal_items + mano_obra + gastos_generales) * 0.10

        total_neto = subtotal_items + mano_obra + gastos_generales + utilidad
        iva = total_neto * 0.19
        total_bruto = total_neto + iva

        # --- GENERACION PDF ---
        pdf = CotizacionPDF()
        pdf.add_page()
        
        pdf.set_font('Helvetica', 'B', 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, f'Presupuesto Preliminar: {receta_id}', 0, 1)
        
        pdf.set_font('Helvetica', '', 11)
        pdf.cell(0, 6, f'Cliente: {nombre}', 0, 1)
        pdf.cell(0, 6, f'Área: {area} m2', 0, 1)
        pdf.cell(0, 6, f'Comuna: {comuna}', 0, 1)
        pdf.cell(0, 6, f'Fecha: {datetime.now().strftime("%d/%m/%Y")}', 0, 1)
        pdf.ln(10)

        # Tabla de Partidas
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_fill_color(240, 240, 240)
        pdf.cell(100, 8, 'Descripción Partida', border=1, fill=True)
        pdf.cell(20, 8, 'Cant.', border=1, fill=True, align='C')
        pdf.cell(30, 8, 'P. Unit.', border=1, fill=True, align='R')
        pdf.cell(40, 8, 'Total Neto', border=1, fill=True, align='R')
        pdf.ln(8)

        pdf.set_font('Helvetica', '', 9)
        for item in items_calculados:
            pdf.cell(100, 8, item['nombre'][:55], border=1)
            pdf.cell(20, 8, f"{item['cantidad']} {item['unidad']}", border=1, align='C')
            pdf.cell(30, 8, f"${int(item['unitario']):,}", border=1, align='R')
            pdf.cell(40, 8, f"${int(item['total']):,}", border=1, align='R')
            pdf.ln(8)

        # Mano de Obra y Otros
        pdf.cell(100, 8, 'Mano de Obra Especializada (Estimada)', border=1)
        pdf.cell(20, 8, '1 gl', border=1, align='C')
        pdf.cell(30, 8, '-', border=1, align='R')
        pdf.cell(40, 8, f"${int(mano_obra):,}", border=1, align='R')
        pdf.ln(8)

        pdf.cell(150, 8, 'Gastos Generales y Seguros', border=1, align='R')
        pdf.cell(40, 8, f"${int(gastos_generales):,}", border=1, align='R')
        pdf.ln(8)

        # Totales
        pdf.ln(5)
        pdf.set_font('Helvetica', 'B', 11)
        pdf.cell(150, 8, 'Subtotal Neto:', align='R')
        pdf.cell(40, 8, f'${int(total_neto):,}', align='R')
        pdf.ln(8)
        
        pdf.set_font('Helvetica', '', 11)
        pdf.cell(150, 8, 'IVA (19%):', align='R')
        pdf.cell(40, 8, f'${int(iva):,}', align='R')
        pdf.ln(8)
        
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(232, 115, 12)
        pdf.cell(150, 10, 'TOTAL COTIZACIÓN:', align='R')
        pdf.cell(40, 10, f'${int(total_bruto):,}', align='R')
        pdf.ln(15)

        pdf.set_font('Helvetica', 'I', 8)
        pdf.set_text_color(100, 100, 100)
        nota = (f"Nota: Este presupuesto se ha calculado utilizando el modelo de Análisis de Precios Unitarios (APU) "
                f"conectado a nuestra base de datos de materiales con precios reales de mercado (Sodimac, Easy, Kupfer, MINVU). "
                f"Proporción de Mano de Obra estimada al 40%. Válido por 5 días.")
        pdf.multi_cell(0, 4, nota)

        # Exportar a Bytes IO
        pdf_bytes = pdf.output(dest='S')
        stream = BytesIO(bytes(pdf_bytes))

        return send_file(
            stream,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'Cotizacion_{nombre.replace(" ", "_")}.pdf'
        )

    except Exception as e:
        print(f"Error procesando: {e}")
        return jsonify({'error': str(e)}), 500

