import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {addDoc, collection, doc, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBbTjug5_iJOwL_u6IaqJQ3jEF_e9N3Ls",
  authDomain: "chat-application-81625.firebaseapp.com",
  projectId: "chat-application-81625",
  storageBucket: "chat-application-81625.firebasestorage.app",
  messagingSenderId: "563012120580",
  appId: "1:563012120580:web:0a9edaecbff5051b1c0551",
  measurementId: "G-B3678GW2VZ"
};

const app =  initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const listenForChats = (setChats) => {
  //fetch chats
  const chatsRef = collection(db, 'chats');
  const unsubscribe = onSnapshot(chatsRef, (snapshot)=>{
    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //filter to current user
    const filteredChats = chatList.filter((chat) => chat.users.some((user) => user.email === auth.currentUser.email));
    setChats(filteredChats);
  });

  return unsubscribe;
}

export const sendMessage = async (messageText, chatId, user1, user2) => {
  const chatRef = doc(db, "chats", chatId)

  const user1Doc = await getDoc(doc(db, 'user', user1));
  const user2Doc = await getDoc(doc(db, 'user', user2));

  console.log(user1Doc);
  console.log(user2Doc);

  const chatDoc = await getDoc(chatRef);
  if(!chatDoc.exists()){
    await setDoc(chatRef, {
      users : [user1Doc.data(), user2Doc.data()],
      lastMessage : messageText,
      lastMessageTimeStamp : serverTimestamp(),
    })
  }else{
    await updateDoc(chatRef, {
      lastMessage : messageText,
      lastMessageTimeStamp : serverTimestamp(),
    });
  }

  const messageRef = collection(db, "chats", chatId, "messages");

  await addDoc(messageRef, {
    text: messageText,
    sender: auth.currentUser.email,
    timestamp: serverTimestamp(),
    
  })
}
export const listenForMessages = (chatId, setMessages) => {
  const chatRef = collection(db, "chats", chatId, "messages");
  onSnapshot(chatRef, (snapshot) =>{
    const messages = snapshot.docs.map((doc) => doc.data(
      
    ));
    setMessages(messages);
  });
}
export {auth, db};