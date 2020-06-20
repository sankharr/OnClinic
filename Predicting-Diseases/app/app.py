# -*- coding: utf-8 -*-
"""
Created on Tue May  5 20:24:21 2020

@author: Ransaka
"""
import time
import datetime
import os
from reportlab.pdfgen import canvas 
import random, string
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# import firebase_admin
# from firebase_admin import credentials, firestore, storage

# 
# import firebase_admin
# from firebase_admin import credentials, firestore, storage

# 
import smtplib, ssl
from random import randint
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
# from random import randint
# mail
import numpy as np
import urllib
import bs4
# import selenium.webdriver as selenium
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import pandas as pd
from flask import Flask, request, jsonify, render_template
import pickle
import csv
#from twilio.rest import Client
import boto3

from firebase import firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, storage


with open('api.csv', newline='') as f:
    reader = csv.reader(f)
    fresh_data = dict(reader) 
    data = fresh_data.copy()

cred   = credentials.Certificate('firebase-sdk.json')
firebase_admin.initialize_app(cred,{'storageBucket': 'onclinic-dd11a.appspot.com'})
db = firestore.client()

#print(data.values())
app = Flask(__name__)
model = pickle.load(open('../Models/newTrained/model_decisiontree.pkl','rb'))
df = pd.read_csv('mostImportant.csv')
dict_ = dict(zip(df.Date, df.DateValue))


@app.route('/api/predict',methods=["POST"])
def predict():
    symptom = request.get_json()
    data = fresh_data.copy()
    # print(symptom)
    for i in range(len(symptom)):
        data[symptom[i]] = 1
    #features = data.values()
    #print(features)
    vals = np.fromiter(data.values(), dtype=float)
    disease = model.predict([vals])
    # print(disease)
    return jsonify(disease[0])

@app.route('/api/email',methods=['POST'])
def sendEmail():
    data = request.get_json()
    # print(data)
    uid = data[1]
    data = data[0]
    email = (data[1])
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "ransakaravi@gmail.com"
    password = 'qchaos@123'
    receiver_email = email
    OTP = data[0]
    url = "http://localhost:4200//emailverify?key="+uid+"&secret="+OTP
    print(url)
    # args = {"key": uid, "secret": OTP}
     # OTP
    # url = "http://127.0.0.1:4200/emailverify/?{}".format(urllib.parse.urlencode(args))
    # print(url)
    msg = MIMEMultipart('alternative')
    text = url
    html = """\
    <html>
      <head></head>
      <body>
        <p>Hi!<br>
           How are you?<br>
           Here is the <a href="{url}">link</a> you wanted.
        </p>
      </body>
    </html>
    """.format(url=url)
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')
    msg.attach(part1)
    msg.attach(part2)

    # message = "OTP"
    context = ssl.create_default_context()

    # return jsonify(email,uid,OTP)

    try:
        server = smtplib.SMTP(smtp_server,port)
        server.ehlo() # Can be omitted
        server.starttls(context=context) # Secure the connection
        server.ehlo() # Can be omitted
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        return addOTP(uid,OTP)
    except Exception as e:
        # Print any error messages to stdout
        print(e)
        return jsonify(False)
    finally:
        server.quit()
        # return ()

@app.route('/api/disease',methods=["POST"])
def disease():
    disease = request.get_json()
    print(str(disease))
    str_disease = str(disease)
    symptoms = dict_[str_disease]
    symptoms = symptoms.split(',')
    return jsonify(symptoms)

'''
when user clicks a link he/she will navigate into site and it will automatically
verify  user email
'''
@app.route('/api/emailverify',methods=["POST"])
def emailverify():
    data = request.get_json()
    print(data)
    uid = str(data[0])
    code = data[1]
    doc_ref = db.collection(u'Users').document(uid)
    doc = doc_ref.get()
    # print(doc.to_dict)
    if doc.exists:
        data = ((doc.to_dict()))
        # print(type(data))
        otp = data['emailOtp']
        if verifyOtp(code,otp):
            return jsonify("email verified")
        else:
            status = "Invalid otp"
            return jsonify(status)
    else:
        return jsonify('No such document!')
    # user_ref = db.collection(u'Users').document(id)
    # user_ref.update({u'emailVerified': True})

def verifyOtp(otp,code):
    if(otp==code):
        return True
    else:
        return False

'''
When user email succssfuly confirmed we send phone otp and update status
'''
@app.route('/api/phoneotp',methods=["POST"])
def updatePhonenumberStatus():
	data = request.get_json()
	uid = data[0]
	phoneOtp = data[1]
	user_ref = db.collection(u'Users').document(uid)
	user_ref.update({u'PhoneNumberVerified':False})
	user_ref.update({u'emailVerified':True})
	user_ref.update({u'PhoneNumberOtp':phoneOtp})
	return jsonify(phoneOtp,uid)

@app.route('/api/address',methods=["POST"])
def pdf_gen():
	data = request.get_json()
	x = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
	fileName = str(x)+".pdf"
	doc = SimpleDocTemplate(fileName,pagesize=letter,
	                        rightMargin=72,leftMargin=72,
	                        topMargin=72,bottomMargin=18)
	Story=[]
	logo = "python.png"

	formatted_time = time.ctime()
	full_name = data[0]
	code = data[1]
	uid = data[3]
	address_parts = data[2]

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

	# cred = credentials.Certificate("./onclinic-dd11a-firebase-adminsdk-g3ixz-639c96122f.json")
	# firebase_admin.initialize_app(cred, {'storageBucket': 'onclinic-dd11a.appspot.com'})
	db = firestore.client()
	bucket = storage.bucket()
	blob = bucket.blob(fileName)
	outfile=fileName
	blob.upload_from_filename(outfile)
	pdf_url = blob.generate_signed_url(datetime.timedelta(days=300), method='GET')
	print(pdf_url)
	os.remove(fileName)
	print(fileName)
	return address_ststus(uid,pdf_url)



'''
verify doctor using slmc site
'''
@app.route('/api/doctor_verification',methods=["POST"])
def doctor_verification():
    data = request.get_json()
    # print(data)
    # print(data[1])
    uid = data[1]
    # print(uid)
    data = data[0]
    reg_no = str(data['docID'])
    act_no = str(data['age'])
    FullName = str(data['name'])
    email = str(data['email'])

    try:
        my_url = 'https://www.srilankamedicalcouncil.org/registry.php?registry='+(act_no)+'&initials=&last_name=&other_name=&reg_no='+(reg_no)+'&nic=&part_of_address=&search=Search'
        uCLient = uReq(my_url)
        # print(my_url)
        page_html = uCLient.read()
        uCLient.close()    
        # data = []
        page_soup = soup(page_html,"html.parser")
        table = page_soup.find(lambda tag: tag.name=='table' and tag.has_attr('id') and tag['id']=="r_table") 
        rows = table.findAll(lambda tag: tag.name=='tr')
        for row in rows:
            cells = row.findAll('td')
            cells = [ele.text.strip() for ele in cells]
        name_web = cells[3].replace(" ","")
        FullName2 = FullName.strip()
        docName = FullName2.replace(" ","")

        print(docName,name_web)

        if(docName==name_web):
            status = "valid doctor"
            return updateFlag(email,FullName, uid,True,status)

        else:
            status = 'invalid doctor'
            return updateFlag(email,FullName,uid,False,status)
        # return jsonify(cells)
    except:
        status = "No Doctor data associated with this credintials"
        return updateFlag(email,FullName,uid,False,status)

'''
send otp into user phone
'''

@app.route('/api/sendtextmessage',methods=["POST"])
def sendTextMessage():
    data = request.get_json()
    uid = data[0]
    PhoneNumber = data[1]
    phoneOtp = randint(1000, 99999)
    user_ref = db.collection(u'Users').document(uid)
    user_ref.update({u'PhoneNumberVerified': False})
    user_ref.update({u'emailVerified':True})
    user_ref.update({u'PhoneNumberOtp': phoneOtp})
    client = boto3.client(
        "sns",
        aws_access_key_id = "XXXXXXXXXXXXXXXXXXXXX",
        aws_secret_access_key = "XXXXXXXXXXXXXXX",
        region_name = "eu-west-1"
    )
    client.publish(
        PhoneNumber = PhoneNumber,
        # code = "Your OTP is"+ phoneOtp
        Message = "Your OTP: "+str(phoneOtp)
    )
    return jsonify("Phone Verification sent")


# @app.route('/api/phoneverify',methods=["POST"])
# def phoneverify():
# 	data = request.get_json()
# 	print(data)
# 	uid = data[0]
# 	otp = data[1]
# 	doc_ref = db.collection(u'Users').document(uid)
# 	doc = doc_ref.get()
# 	if doc.exists:
# 		data = doc.to_dict()

# 	return jsonify(data)

'''
    data = request.get_json()
    print(data)
    uid = str(data[0])
    code = data[1]
    doc_ref = db.collection(u'Users').document(uid)
    doc = doc_ref.get()
    # print(doc.to_dict)
    if doc.exists:
        data = ((doc.to_dict()))
        # print(type(data))
        otp = data['emailOtp']
        if verifyOtp(code,otp):
            return jsonify("email verified")
        else:
            status = "Invalid otp"
            return jsonify(status)
    else:
        return jsonify('No such document!')
'''



def updateFlag(email,name,id,flag,status):
    user_ref = db.collection(u'Users').document(id)
    user_ref.update({u'slmcVerified': flag})
    # dody = [flag,ststus]
    return jsonify(email,name,status)

def addOTP(id,OTP):
    user_ref = db.collection(u'Users').document(id)
    user_ref.update({u'emailOtp': OTP})
    user_ref.update({u'emailVerified':False})
    return jsonify(OTP,True)

def address_ststus(id,url):
    user_ref = db.collection(u'Users').document(id)
    user_ref.update({u'report_url':url})
    return jsonify(url)

# def uploadFIle():
#     cred = credentials.Certificate("./onclinic-dd11a-firebase-adminsdk-g3ixz-639c96122f.json")
#     firebase_admin.initialize_app(cred, {
#     'storageBucket': 'onclinic-dd11a.appspot.com'
#     })
#     db = firestore.client()
#     bucket = storage.bucket()
#     blob = bucket.blob('file.pdf')
#     outfile='./file.pdf'
#     blob.upload_from_filename(outfile)





if __name__ == "__main__":
    app.run(debug=True)