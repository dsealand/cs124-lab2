import './App.css';
import React from 'react';
import Header from './Header';
import { Tab } from './Tab';
import ListContainer from './ListContainer';
import Modal from './Modal';
import { useState, useEffect } from 'react';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import { initializeApp } from "firebase/app";
import {
    collection, doc, getFirestore, query, orderBy, setDoc, updateDoc, deleteDoc,
    serverTimestamp, where
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
    getAuth, sendEmailVerification, signOut } from "firebase/auth";

import {
    useAuthState, useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword,
    useSignInWithGoogle } from 'react-firebase-hooks/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDs9yo12K8YT79DyMVEguJ25hO0d9V-JwQ",
    authDomain: "cs124-lab3-d845a.firebaseapp.com",
    projectId: "cs124-lab3-d845a",
    storageBucket: "cs124-lab3-d845a.appspot.com",
    messagingSenderId: "204426368246",
    appId: "1:204426368246:web:c8c15574b455c27c0448d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
const collectionName = "People-AuthenticationRequired"

const tabCollectionName = "tabs-0";
const tabsCollection = collection(db, tabCollectionName);

function App(props) {
    const [isShowCompleted, setIsShowCompleted] = useState(true);
    const [sortOrder, setSortOrder] = useState("updated desc");
    const [activeTab, setActiveTab] = useState(0);
    const [modal, setModal] = useState({show: false})

    const tasksCollection = collection(db, `${tabCollectionName}/${activeTab}/tasks`);

    const [tabs, tabsLoading, tabsError] = useCollectionData(query(tabsCollection, orderBy("created")));
    const [tasks, tasksLoading, tasksError] = useCollectionData(query(tasksCollection, orderBy(...sortOrder.split(" "))));

    const [user, loading, error] = useAuthState(auth);

    function verifyEmail() {
        sendEmailVerification(user);
    }


    useEffect(() => {
        if (activeTab === 0 && !(tabsError || tabsLoading)) {
            setActiveTab(tabs[0].id);
        }
    });

    function handleToggleShowCompleted() {
        setIsShowCompleted(!isShowCompleted);
    }

    function handleDeleteCompleted() {
        const completedTasks = tasks.filter((t) => t.isCompleted)

        completedTasks.forEach((t) => {
            deleteDoc(doc(tasksCollection, t.id));
        });
    }

    function handleChangeField(id, field, value) {
        updateDoc(doc(tasksCollection, id),
            {
                [field]: value,
                updated: serverTimestamp()
            })
    }

    function handleToggleItemCompleted(id) {
        handleChangeField(id, "isCompleted", !tasks.find(t => t.id === id).isCompleted)
    }

    function handleAddNewTask(task) {
        const uniqueID = generateUniqueID();
        setDoc(doc(tasksCollection, uniqueID),
            {
                id: uniqueID,
                text: task,
                isCompleted: false,
                priority: 1,
                updated: serverTimestamp()
            });
    }

    function handleDeleteById(id) {
        deleteDoc(doc(tasksCollection, id));
    }

    function handleAddTab(tabName) {
        const uniqueID = generateUniqueID();
        setDoc(doc(tabsCollection, uniqueID),
            {
                id: uniqueID,
                name: tabName,
                created: serverTimestamp()
            });
    }

    function handleSelectTab(id) {
        setActiveTab(id);
    }

    function handleBlur(e) {
        if (e.target.value !== "") {
            handleAddTab(e.target.value);
            document.getElementById("newTabInput").value = "";
        }
    }

    function handleDeleteTab(id) {
        deleteDoc(doc(tabsCollection, id));
        setActiveTab(tabs[0].id)
    }

    if (loading) return <div>Loading ...</div>
    /*if (tasksLoading || tabsLoading || loading) return (<div></div>)
    if (tasksError) return (<div>{`Error: ${tasksError}`}</div>)
    if (tabsError) return (<div>{`Error: ${tabsError}`}</div>)
  */
    else if (user) return (
        <div className="App">
            <div className="header">
                <Header
                    onToggleShowCompleted={handleToggleShowCompleted}
                    setModal={setModal}
                    onDeleteCompleted={handleDeleteCompleted}
                    isShowCompleted={isShowCompleted}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                ></Header>
            </div>
            <div className="content">
                <ListContainer
                    items={tasks.filter(t => !t.isCompleted || isShowCompleted)}
                    onChangeField={handleChangeField}
                    onToggleItemCompleted={handleToggleItemCompleted}
                    onAddNewTask={handleAddNewTask}
                    onDeleteById={handleDeleteById}
                />
                {modal.show &&
                    <Modal {...modal}>
                        {modal.children}
                    </Modal>}
            </div>
            <div className="footer">
                <ol className="tab-list">
                    {tabs.map(tab =>
                        <Tab
                            key={tab.id}
                            id={tab.id}
                            activeTab={activeTab}
                            label={tab.name}
                            onClickTab={handleSelectTab}
                            deleteTab={handleDeleteTab}
                            setModal={setModal}/>)}
                    <li className="new-tab">
                        <input
                            className="new-tab-input"
                            id="newTabInput"
                            defaultValue=""
                            placeholder="New tab"
                            onBlur={handleBlur}
                            autocomplete="off"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.target.blur()
                                }
                            }}
                        />
                    </li>
                </ol>
            </div>
        </div>
    );
    else
        return (<>
                {error && <p>Error App: {error.message}</p>}
                <div className="loginTitle">noteify</div>
                <div className="loginForm">
                    <SignIn className="signIn"/>
                    <SignUp className="signUp"/>
                </div>
            </>
        )
}

function SignIn() {
    const [signInWithEmailAndPassword, user1, loading1, error1] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, user2, loading2, error2] = useSignInWithGoogle(auth);
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    if (user1 || user2) {
        // Shouldn't happen because App should see that
        // we are signed in.
        return <div>Unexpectedly signed in already</div>
    } else if (loading1 || loading2) {
        return <p>Logging in…</p>
    }
    return <div class="signInForm">
        {error1 && <p>"Error logging in: " {error1.message}</p>}
        {error2 && <p>"Error logging in: " {error2.message}</p>}
        <h1>Sign in</h1>
        <input type="text" id='email' value={email} placeholder="Email"
               onChange={e=>setEmail(e.target.value)}/>
        <br/>
        <input type="text" id='pw' value={pw} placeholder="Password"
               onChange={e=>setPw(e.target.value)}/>
        <br/>
        <button className="signButton" onClick={() =>signInWithEmailAndPassword(email, pw)}>
            Sign in with Email
        </button>
        <button className="signButton" onClick={() => signInWithGoogle()}>
            Sign in with Google
        </button>
    </div>
}

function SignUp() {
    const [
        createUserWithEmailAndPassword,
        userCredential, loading, error
    ] = useCreateUserWithEmailAndPassword(auth);
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    if (userCredential) {
        // Shouldn't happen because App should see that
        // we are signed in.
        return <div>Unexpectedly signed in already</div>
    } else if (loading) {
        return <p>Signing up…</p>
    }
    return <div class="signUpForm">
        {error && <p>"Error signing up: " {error.message}</p>}
        <h1>Sign up</h1>
        <input type="text" id='email' value={email} placeholder="Email"
               onChange={e=>setEmail(e.target.value)}/>
        <br/>
        <input type="text" id='pw' value={pw} placeholder="Password"
               onChange={e=>setPw(e.target.value)}/>
        <br/>
        <button className="signButton" onClick={() =>
            createUserWithEmailAndPassword(email, pw)}>
            Sign Up
        </button>

    </div>
}


export default App;
