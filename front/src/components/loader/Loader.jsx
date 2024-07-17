import React, { useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';

const TypewriterText = () => {
  const phrases = [
    "Bonjour, comment ça va ?",
    "Je suis un texte qui apparaît.",
    "Puis je disparais ensuite.",
    "En utilisant React et typewriter-effect !"
  ];

  const typewriterRef = useRef(null);
  let typewriter = useRef(null);

  useEffect(() => {
    typewriter.current = new Typewriter(typewriterRef.current, {
      loop: true,
      deleteSpeed: 20,
      delay: 1000
    });

    return () => {
      typewriter.current.stop(); // Arrête le typewriter lorsque le composant est démonté
    };
  }, []);

  useEffect(() => {
    typewriter.current.pauseFor(2500).deleteAll();
    phrases.forEach((phrase, index) => {
      typewriter.current.typeString(phrase).pauseFor(2500).deleteAll();
    });
    typewriter.current.start();
  }, [phrases]);

  return (
    <div>
      <h2>Texte qui apparaît et disparaît :</h2>
      <div ref={typewriterRef}></div>
    </div>
  );
};

export default TypewriterText;
