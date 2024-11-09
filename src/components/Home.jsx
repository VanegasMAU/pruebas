import React, { useEffect, useState } from "react";
import { auth, database } from "../firebaseConfig";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log("Usuario autenticado:", user);

        // Obtener el nombre del usuario desde Realtime Database
        const userRef = ref(database, `users/${user.uid}`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Datos del usuario:", data); // Ver los datos recuperados
            setUserName(data.name); // Asigna el nombre al estado
          } else {
            console.log("No se encontraron datos para este usuario.");
          }
        }).catch((error) => {
          console.error("Error al obtener los datos:", error);
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="container">
      {user ? (
        <h1>Hola, {userName || "Cargando nombre..."}</h1>
      ) : (
        <h1>Cargando...</h1>
      )}
      <button
        onClick={() => auth.signOut().then(() => navigate("/login"))}
        style={{ backgroundColor: "#dc3545" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
