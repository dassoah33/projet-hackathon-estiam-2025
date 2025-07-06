"use client";

import { FaGraduationCap } from "react-icons/fa";
import { useEffect, useState } from "react";

// Skeleton pour le nom
function NameSkeleton() {
  return <div className="mx-auto h-8 w-48 rounded bg-white/30 animate-pulse" />;
}
function ClasseSkeleton() {
  return <div className="mx-auto h-6 w-40 rounded bg-white/30 animate-pulse" />;
}

export default function NfcCard() {
  const [userName, setUserName] = useState("");
  const [classe, setClasse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(`${user.firstname.toUpperCase()} ${user.lastname}`);
        setClasse(user.classe?.nom || "Classe inconnue");
      } catch {
        setUserName("Thomas Simon");
        setClasse("L1 Informatique • A");
      }
    } else {
      setUserName("Thomas Simon");
      setClasse("L1 Informatique • A");
    }
    setLoading(false);
  }, []);

  return (
    <div className="relative w-full max-w-xl h-73 rounded-xl bg-[#6C6CF4] text-white shadow-lg p-8 flex flex-col justify-between mx-auto">
      {/* Logo et icône */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs opacity-80">Carte Étudiante ESTIAM</div>
        </div>
        <div className="bg-white/20 rounded-full p-4">
          <FaGraduationCap className="text-white text-2xl" />
        </div>
      </div>
      {/* Infos étudiant */}
      <div className="mt-4">
        <div className="font-semibold text-3xl leading-tight text-center">
          {loading ? <NameSkeleton /> : userName}
        </div>
        <div className="text-lg opacity-90 text-center">
          {loading ? <ClasseSkeleton /> : classe}
        </div>
      </div>
      {/* Bas de carte */}
      <div className="flex justify-between items-end mt-6">
        <div>
          <div className="text-xs opacity-80">N° Carte</div>
          <div className="tracking-widest text-lg font-mono">•••• 0006</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm opacity-80">2 cours actifs</div>
          <div className="font-semibold text-2xl tracking-wider">NFC</div>
        </div>
      </div>
    </div>
  );
}
