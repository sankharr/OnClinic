import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent } from 'ngx-agora';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { timer, Observable, observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecordingService } from '../services/recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/Rx';
declare var RecordRTC_Extension: any;

@Component({
  selector: 'app-live-consultation',
  templateUrl: './live-consultation.component.html',
  styleUrls: ['./live-consultation.component.css']
})
export class LiveConsultationComponent implements OnInit, OnDestroy {

  localCallId = 'agora_local';
  remoteCalls: any[] = []
  fileName;

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;
  private channelid: any;
  appointmentID: any;
  appointmentData: any;
  timerDisplay: any;
  time: any;
  rating: number;

  timeObservable: any;
  hours = 0;
  minutes = 0;
  seconds = 0;
  prescriptions: any;
  appointmentCountDoc: any;
  docData: any;

  isRecording = false;
  recordedTime;
  blobUrl;
  record_tool: any;
  extensionInstalled: boolean;


  constructor(
    private ngxAgoraService: NgxAgoraService,
    private formbuilder: FormBuilder,
    private db: AngularFirestore,
    private modalService: NgbModal,
    private recorder: RecordingService,
    private sanitizer: DomSanitizer
  ) {
    this.uid = Math.floor(Math.random() * 100);
    this.appointmentID = localStorage.getItem("selectedAppointmentID_patient");
    // this.record_tool = new RecordRTC_Extension();
    try {
      this.record_tool = new RecordRTC_Extension();
      this.extensionInstalled = true;
    } catch (error) {
      window.alert('You dont have installed record rtc extension');
      this.extensionInstalled = false;
    }
    // console.log(typeof RecordRTC_Extension())
    this.recorder.recordingFailed().subscribe(() => {
      this.isRecording = false
    });

    this.recorder.getRecordedTime().subscribe((time) => {
      this.recordedTime = time
    });

    this.recorder.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });

  }

  ngOnDestroy() {
    console.log('destroyed!!');
  }

  ngOnInit() {

    // this.startCall(localStorage.getItem("selectedAppointmentID_patient"));

    this.startCall(localStorage.getItem("selectedAppointmentID_patient"));

    this.db.collection("Appointments").doc(this.appointmentID).valueChanges()
      .subscribe(output => {
        this.appointmentData = output;
        console.log("appointment Data - ", this.appointmentData);

        if (this.appointmentData?.consultationStarted === "true") {
          console.log("start the timer");
          this.timeObservable = timer(0, 1000)
          this.timeObservable.subscribe(x => {
            this.displayTime()
          });
        }
        this.db.collection("Users").doc(localStorage.getItem("selectedAppointmentDoctorUID")).collection("appointmentCounts").doc(this.appointmentData.appointmentShortDate).valueChanges()
          .subscribe(output2 => {
            this.appointmentCountDoc = output2;
            console.log("appointmentCountDoc - ", this.appointmentCountDoc)
          })
      })

    this.db.collection("Users").doc(localStorage.getItem("selectedAppointmentDoctorUID")).valueChanges()
      .subscribe(output => {
        this.docData = output;
      })



  }

  starHandler(value) {
    // var rating:number = value;
    this.rating = Number(value);
    console.log(value, this.rating);
    this.submitRating();
  }

  submitRating() {
    if (this.docData.averageRating == null) {
      console.log("true");
      this.db.collection("Users").doc(localStorage.getItem("selectedAppointmentDoctorUID")).update({
        averageRating: Number(this.rating),
      })
    }
    else {
      var newRating = ((this.docData.averageRating + this.rating) / 2).toFixed(1);
      this.db.collection("Users").doc(localStorage.getItem("selectedAppointmentDoctorUID")).update({
        averageRating: Number(newRating),
      }).then(() => {
        console.log("false - ", newRating);
      })
      console.log("false");
    }
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, {
      centered: true,
      size: 'lg'
    });
    this.db.collection('Users').doc(localStorage.getItem('uid')).collection('Prescriptions', ref => ref.where("uploadedAt", ">=", this.appointmentData.consultationStartedAt)).valueChanges()
      .subscribe(output2 => {
        this.prescriptions = output2;
        console.log("available prescriptions - ", this.prescriptions);
      })
  }

  openRating(content) {
    this.modalService.open(content, {
      centered: true,
      size: 'md'
    });
    this.db.collection('Users').doc(localStorage.getItem('uid')).collection('Prescriptions', ref => ref.where("uploadedAt", ">=", this.appointmentData.consultationStartedAt)).valueChanges()
      .subscribe(output2 => {
        this.prescriptions = output2;
        console.log("available prescriptions - ", this.prescriptions);
      })
  }

  viewPrescription(url) {
    window.open(url, "myWindow", "height=900,width=1000");
  }

  displayTime() {
    if (this.seconds < 59) {
      this.seconds = this.seconds + 1;
    }
    else {
      if (this.minutes < 59) {
        this.minutes = this.minutes + 1;
        this.seconds = 0;
      }
      else {
        this.hours = this.hours + 1;
        this.minutes = 0;
        this.seconds = 0;
      }
    }
  }

  getDisplayTimer(time: number) {
    const hours = '0' + Math.floor(time / 3600);
    const minutes = '0' + Math.floor(time % 3600 / 60);
    const seconds = '0' + Math.floor(time % 3600 % 60);

    return {
      hours: { digit1: hours.slice(-2, -1), digit2: hours.slice(-1) },
      minutes: { digit1: minutes.slice(-2, -1), digit2: minutes.slice(-1) },
      seconds: { digit1: seconds.slice(-2, -1), digit2: seconds.slice(-1) },
    };
  }

  startCall(appoID) {

    // let channelID = this.channelForm.controls["channelid"].value;
    let channelID = appoID;
    console.log("Channel ID - ", channelID);

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
    this.client.leave(() => {

      if (this.localStream.isPlaying()) {
        this.localStream.stop()
      }
      this.localStream.close();

      for (let i = 0; i < this.remoteCalls.length; i++) {
        var stream = this.remoteCalls.shift();
        var id = stream.getId()
        if (stream.isPlaying()) {
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

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.recorder.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.recorder.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.recorder.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

}
