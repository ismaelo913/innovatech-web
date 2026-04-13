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

def get_average_price(category_query_str):
    """Obtiene un promedio rapido neto de productos asociados a un query en la db"""
    init_firebase()
    if not db:
        return 0
    # Buscar precios netos de texto que haga match. Para simplicidad en este prototipo,
    # solo sacaremos los primeros 20 documentos que estén en esa macrocategoría.
    try:
        docs = db.collection('products').where('categoria', '==', category_query_str).limit(20).stream()
        total = 0
        count = 0
        for d in docs:
            data = d.to_dict()
            if 'precio_unitario_neto' in data:
                total += float(data['precio_unitario_neto'])
                count += 1
        return (total / count) if count > 0 else 0
    except:
        return 0

@app.route('/api/cotizar', methods=['POST'])
def cotizar():
    try:
        data = request.json or {}
        servicio = data.get('service', 'Servicio de Construcción')
        area = float(data.get('area', 1))
        nombre = data.get('name', 'Cliente Valioso')
        comuna = data.get('comuna', 'Santiago')

        # Armar un "APU" (Análisis de Precio Unitario) dinámico base
        # Mapeamos el servicio a precios del mercado obtenidos desde Cotizador
        base_cost = 0
        materiales_list = []

        if "Remodelaciones" in servicio:
            # Revestimientos, yeso cartón, pintura
            cat_price = get_average_price("Tabiquería Interior") or 3500
            pintura = get_average_price("Pintura") or 2500
            mo_price = get_average_price("Mano de Obra") or 35000
            m2_cost = cat_price + pintura + (mo_price * 0.15)
            materiales_list = ["Volcanita / Revestimientos m2", "Pintura base y látex", "Mano de Obra Especializada"]
        elif "Obra Gruesa" in servicio:
            cat_price = get_average_price("Hormigones y Morteros") or 9000
            acero = get_average_price("Acero de Refuerzo") or 6000
            mo_price = get_average_price("Mano de Obra") or 40000
            m2_cost = (cat_price * 0.2) + acero + (mo_price * 0.15)
            materiales_list = ["Hormigón estructural / Morteros", "Enfierradura / Acero", "Mano de Obra Gruesa"]
        elif "Terminaciones" in servicio:
            pisos = get_average_price("Pisos y Pavimentos") or 12000
            puertas = get_average_price("Puertas") or 25000
            mo_price = get_average_price("Mano de Obra") or 35000
            m2_cost = pisos + (puertas * 0.1) + (mo_price * 0.2)
            materiales_list = ["Revestimientos de Piso", "Puertas / Quincallería", "Instaladores / Terminaciones"]
        else:
            m2_cost = 55000
            materiales_list = ["Materiales de Ejecución", "Mano de Obra Constructiva"]

        # Margen Beneficio o Administracion + GGQQ
        m2_cost *= 1.35 

        total_neto = m2_cost * area
        iva = total_neto * 0.19
        total_bruto = total_neto + iva

        # --- GENERACION PDF ---
        pdf = CotizacionPDF()
        pdf.add_page()
        
        pdf.set_font('Helvetica', 'B', 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, f'Cotización Automática', 0, 1)
        
        pdf.set_font('Helvetica', '', 11)
        pdf.cell(0, 6, f'Servicio: {servicio}', 0, 1)
        pdf.cell(0, 6, f'Cliente: {nombre}', 0, 1)
        pdf.cell(0, 6, f'Ubicación: {comuna}', 0, 1)
        pdf.cell(0, 6, f'Área estimada: {area} m2', 0, 1)
        pdf.cell(0, 6, f'Fecha: {datetime.now().strftime("%d/%m/%Y")}', 0, 1)
        pdf.ln(10)

        # Tabla de Detalles
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_fill_color(240, 240, 240)
        pdf.cell(140, 10, 'Descripción de la Partida', border=1, fill=True)
        pdf.cell(50, 10, 'Valor NETO', border=1, fill=True, align='R')
        pdf.ln(10)

        pdf.set_font('Helvetica', '', 11)
        desc = f"Servicio integral por {area} m2."
        pdf.cell(140, 10, desc, border='L T R')
        pdf.cell(50, 10, f'${int(total_neto):,}', border='L T R', align='R')
        pdf.ln(10)

        # Desglose Insumos
        pdf.set_font('Helvetica', 'I', 10)
        pdf.set_text_color(80, 80, 80)
        pdf.cell(140, 6, 'La estimación incluye materiales de base reales:', border='L R')
        pdf.cell(50, 6, '', border='L R')
        pdf.ln(6)
        for mat in materiales_list:
            pdf.cell(140, 6, f'- {mat}', border='L R')
            pdf.cell(50, 6, '', border='L R')
            pdf.ln(6)
        
        pdf.cell(140, 0, '', border='T')
        pdf.cell(50, 0, '', border='T')
        pdf.ln(5)

        # Totales
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Helvetica', '', 12)
        pdf.cell(140, 8, 'Subtotal Neto:', align='R')
        pdf.cell(50, 8, f'${int(total_neto):,}', align='R')
        pdf.ln(8)
        
        pdf.cell(140, 8, 'IVA (19%):', align='R')
        pdf.cell(50, 8, f'${int(iva):,}', align='R')
        pdf.ln(8)
        
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(232, 115, 12)
        pdf.cell(140, 10, 'TOTAL BRUTO APROXIMADO:', align='R')
        pdf.cell(50, 10, f'${int(total_bruto):,}', align='R')
        pdf.ln(15)

        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(100, 100, 100)
        nota = ("Nota Importante: Este informe se genera automáticamente extrayendo precios "
                "de mercado chilenos reales en nuestra base de datos dinámica. Es un valor "
                "PRELIMINAR y referencial. El monto final requiere visita técnica en terreno.")
        pdf.multi_cell(0, 5, nota)

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

