import React from "react";
import "./main.css";

import axios from "axios";
import Loader from "./components/loader/Loader";

const App = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
      setLoading(false);
      console.log(res.data);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  return (
    <div className="app mx-auto">
      <h1 className="font-bold mb-4">History Street</h1>
      {(!loading || !response) && (
        <section className="input-container">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </section>
      )}
      <section className="response-container">
        {response && (
          <div className="response w-[60%] mx-auto flex flex-col">
            <h2 className="text-3xl self-center mb-3">{response.title}</h2>
            <div className="flex flex-col gap-4">
              <p>{response.historyStreetName}</p>
              {Object?.keys(response.paragraphs).map((key, index) => (
                <p key={index}>{response.paragraphs[key]}</p>
              ))}
            </div>
          </div>
        )}
      </section>
      {/* <Loader /> */}
    </div>
  );
};

export default App;
