import time
import datetime
import os
from reportlab.pdfgen import canvas 
import random, string
from flask import Flask, request, jsonify, render_template
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

import firebase_admin
from firebase_admin import credentials, firestore, storage

def pdfGen():
	x = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
	code = str(x)[0:5]
	fileName = str(x)+".pdf"
	doc = SimpleDocTemplate(fileName,pagesize=letter,
	                        rightMargin=72,leftMargin=72,
	                        topMargin=72,bottomMargin=18)
	Story=[]
	logo = "python.png"

	formatted_time = time.ctime()
	full_name = "Don Anil Jasinghe"
	address_parts = ["29/3A,Second Lane", "Purana Road, Wattegedara, Maharagama"]

	im = Image(logo, 3*inch, 2*inch)
	Story.append(im)

	styles=getSampleStyleSheet()
	styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
	ptext = '<font size="12">%s</font>' % formatted_time

	Story.append(Paragraph(ptext, styles["Normal"]))
	Story.append(Spacer(1, 12))

	# Create return address
	ptext = '<font size="12">%s</font>' % full_name
	Story.append(Paragraph(ptext, styles["Normal"]))       
	for part in address_parts:
	    ptext = '<font size="12">%s</font>' % part.strip()
	    Story.append(Paragraph(ptext, styles["Normal"]))   

	Story.append(Spacer(1, 12))
	ptext = '<font size="12">Dear %s:</font>' % full_name.split()[0].strip()
	Story.append(Paragraph(ptext, styles["Normal"]))
	Story.append(Spacer(1, 12))

	ptext = '<font size="12">We would like to welcome you to Onclinic Platform. As you already know Onclinic is the\
	        Best platform for Online channeling and Doctor booking. This is your final part of registration. All u want to do is\
	        Add verification code in web browser</font>'
	Story.append(Paragraph(ptext, styles["Justify"]))
	Story.append(Spacer(1, 12))


	ptext = '<font size="12">Here is your Verification Code: %s</font>' %(code)
	Story.append(Paragraph(ptext, styles["Justify"]))
	Story.append(Spacer(1, 15))

	ptext = '<font size="12">Thank you very much and we look forward to serving you.</font>'
	Story.append(Paragraph(ptext, styles["Justify"]))
	Story.append(Spacer(1, 12))
	ptext = '<font size="12">Sincerely,</font>'
	Story.append(Paragraph(ptext, styles["Normal"]))
	Story.append(Spacer(1, 48))
	ptext = '<font size="12">Ran Sucker</font>'
	Story.append(Paragraph(ptext, styles["Normal"]))
	Story.append(Spacer(1, 12))
	doc.build(Story)

	cred = credentials.Certificate("./onclinic-dd11a-firebase-adminsdk-g3ixz-639c96122f.json")
	firebase_admin.initialize_app(cred, {'storageBucket': 'onclinic-dd11a.appspot.com'})
	db = firestore.client()
	bucket = storage.bucket()
	blob = bucket.blob(fileName)
	outfile=fileName
	blob.upload_from_filename(outfile)
	print(blob.generate_signed_url(datetime.timedelta(days=300), method='GET'))

	os.remove(fileName)
	return jsonfy(fileName)