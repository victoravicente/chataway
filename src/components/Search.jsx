
import React, { useContext, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        //buscar o chat das pessoa pesquisada no bd se existir, se nao criar um
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                //Criar um chat na banco onde é armazenado os chats
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //Criar um chat com o usuario
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) { }

        setUser(null);
        setUsername("")
    };
    return (
        <div className="search">
            <div className="searchForm">
                <input
                    type="text"
                    placeholder="Procure um usuario"
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span>Usuario não encontrado!</span>}
            {user && (
                <div className="userChat" onClick={handleSelect}>
                    <img src={user.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search