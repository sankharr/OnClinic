import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent } from 'ngx-agora';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf'
// declare var jsPDF: any;
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePipe } from '@angular/common';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-live-consultation-doctor',
  templateUrl: './live-consultation-doctor.component.html',
  styleUrls: ['./live-consultation-doctor.component.css']
})
export class LiveConsultationDoctorComponent implements OnInit {

  @ViewChild('htmlData') htmlData:ElementRef;

  localCallId = 'agora_local';
  remoteCalls: any[] = []
  prescriptionContent = []
  otherNotesArray = []

  prescriptionForm: FormGroup

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;
  private channelid: any;
  channelID: string;
  appointmentData: any;
  dateToday;
  task: AngularFireUploadTask;

  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  fb;
  patientUID: string;


  constructor(
    private ngxAgoraService: NgxAgoraService,
    private db: AngularFirestore,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private afStorage: AngularFireStorage
    // private formbuilder: FormBuilder,
    ) {
    this.uid = Math.floor(Math.random() * 100);
    this.channelID = localStorage.getItem('selectedAppointmentID_doctor');
    this.dateToday = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    
  }

  ngOnInit(): void {
    this.prescriptionForm = this.formBuilder.group({
      content: ["", Validators.required],
      otherNotes: ["", Validators.required],
    })
    this.db.collection('Appointments').doc(this.channelID).valueChanges()
    .subscribe(output => {
      this.appointmentData = output;
    })    
    this.startCall(this.channelID);

  }

  addOtherNotes(){
    this.otherNotesArray.push(this.prescriptionForm.controls['otherNotes'].value)
    // console.log("prescriptionContentArray - ",this.prescriptionContent);
    this.prescriptionForm.reset();
  }

  removeNote(val){
    var index = this.otherNotesArray.indexOf(val);
    this.otherNotesArray.splice(index,1);
    // console.log("from removeQualifications, val index qualificationsArray - ",val,index,this.qualificationsArray)
  }  

  addPrescriptionLines(){
    this.prescriptionContent.push(this.prescriptionForm.controls['content'].value)
    console.log("prescriptionContent Array - ",this.prescriptionContent);
    this.prescriptionForm.reset();
  }

  removePrescriptionLines(val){
    var index = this.prescriptionContent.indexOf(val);
    this.prescriptionContent.splice(index,1);
    // console.log("from removeQualifications, val index qualificationsArray - ",val,index,this.qualificationsArray)
  }  

  openVerticallyCentered(content) {
    this.modalService.open(content, { 
      centered: true,
      size: 'lg'
    });
  }

  formReset(){
    this.prescriptionForm.reset();
    this.prescriptionContent = [];
    this.otherNotesArray = [];
  }

  htmlToPdf() {

    // let DATA = this.htmlData.nativeElement;
    // let doc = new jsPDF('p','pt', 'a4');

    // let handleElement = {
    //   '#editor':function(element,renderer){
    //     return true;
    //   }
    // };
    // doc.fromHTML(DATA.innerHTML,15,15,{
    //   'width': 200,
    //   'elementHandlers': handleElement
    // });

    // doc.save('angular-demo.pdf');

    this.db.collection('Users',ref => ref.where("patientID","==",this.appointmentData.patientID)).snapshotChanges()
    .subscribe(output =>{
      this.patientUID = output[0].payload.doc.id;
      console.log("patient UID - ",this.patientUID);
    })

    const doc = new jsPDF('p','pt', 'a5')
    const ta = document.getElementById('htmlData');
    doc.fromHTML(ta, 20, 20);
    // doc.sav e('demo.pdf')

    const file = doc.output("blob");
    const filePath = `Prescriptions/${this.appointmentData.patientID}/${this.dateToday}_${this.appointmentData.doctorName}`;
    const fileRef = this.afStorage.ref(filePath);
    this.task = this.afStorage.upload(filePath, file);
    this.uploadProgress = this.task.percentageChanges();

    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log("url from finalize - ", this.fb);
            this.db.collection('Users').doc(this.patientUID).collection("Prescriptions").add({
              // reportDate: repDate,
              // reportName: repName,
              prescriptionID:this.dateToday+'_'+this.appointmentData.doctorName,
              doctorName: this.appointmentData.doctorName,
              doctorID: this.appointmentData.doctorID,
              prescriptionURL:this.fb,
              uploadedAt: new Date(),
              status: 'Active'
            })
            setTimeout(()=>{
              this.prescriptionContent = []
              this.otherNotesArray = []
            },500)
          });
        }),
      )
      .subscribe(url => {
        if (url) {
          console.log("url from subscribe - ", url);
        }
      });





    // let DATA = this.htmlData.nativeElement;
    // let doc = new jsPDF('p','pt', 'a4');
    // doc.fromHTML(DATA.innerHTML,15,15);
    // doc.save('demo.pdf');
    
}



  startCall(appoID) {

    this.db.collection("Appointments").doc(appoID).update({
      consultationStarted:"true",
      consultationStartedAt:new Date()
    });

    // let channelID = this.channelForm.controls["channelid"].value;
    let channelID = appoID;
    console.log("Channel ID - ",channelID);

    this.channelid = channelID;

    this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();

    // Added in this step to initialize the local A/V stream
    this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
    this.assignLocalStreamHandlers();
    // this.initLocalStream();
    this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
    
  }

  endCall() {
    this.db.collection("Appointments").doc(this.channelID).update({
      status: "Success"
    });
    this.client.leave(()=> {

      if(this.localStream.isPlaying()) {
        this.localStream.stop()
      }
      this.localStream.close();

      for (let i = 0; i < this.remoteCalls.length; i++) {
        var stream = this.remoteCalls.shift();
        var id = stream.getId()
        if(stream.isPlaying()) {
          stream.stop()
        }
        // removeView(id)
      }
    })
  }

  /**
 * Attempts to connect to an online chat room where users can host and receive A/V streams.
 */
  join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(null, this.channelid, this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
    this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      err => console.error('getUserMedia failed', err)
    );
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, evt => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, error => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          renewError => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, err => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }

}
