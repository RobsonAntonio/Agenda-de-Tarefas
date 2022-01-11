import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyBNRxpdtowbXWHHofBi_aGo96CWEHDgysM",
    authDomain: "tarefas-c3592.firebaseapp.com",
    projectId: "tarefas-c3592",
    storageBucket: "tarefas-c3592.appspot.com",
    messagingSenderId: "723235975079",
    appId: "1:723235975079:web:3bd5489e78fd32edc55082"
  };
  
  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig)
  }
  
  export default firebase;