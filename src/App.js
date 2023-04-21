import "./styles.css";
import React, { useState, useEffect } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  ChecksumException,
  FormatException,
  DecodeHintType,
  BarcodeFormat,
  sourceSelect,
} from "@zxing/library";

export default function () {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [code, setCode] = useState("");
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const hints = new Map();
  const formats = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.PDF_417
  ];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  hints.set(DecodeHintType.TRY_HARDER, true);
  const codeReader = new BrowserMultiFormatReader(hints);

  console.log("ZXing code reader initialized");

  useEffect(() => {
    codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        setupDevices(videoInputDevices);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function setupDevices(videoInputDevices) {
    const sourceSelect = document.getElementById("sourceSelect");

    // selects first device
    setSelectedDeviceId(videoInputDevices[1].deviceId);

    // setup devices dropdown
    if (videoInputDevices.length >= 1) {
      setVideoInputDevices(videoInputDevices);
    }
  }

  function resetClick() {
    codeReader.reset();
    setCode("");
    console.log("Reset.");
  }

  function decodeContinuously(selectedDeviceId) {
    codeReader.decodeFromInputVideoDeviceContinuously(
      selectedDeviceId,
      "video",
      (result, err) => {
        if (result) {
          // properly decoded qr code
          console.log("Found QR code!", result);
          setCode(result.text);
          alert(result.text);
          var result = setCode(result.text).split('@');

          var numTramite = result.text[0];
          var apellido = result.text[1];
          var nombre = result.text[2];
          var sexo = result.text[3];
          var dni = result.text[4];
          var FechaNacimiento = result.text[6];
          var fechaEmision = result.text[7];

          console.log('NumeroTramite:', numTramite);
          console.log('Apellido:', apellido);
          console.log('Nombre:', nombre);
          console.log('Sexo:', sexo);
          console.log('dni:', dni);
          console.log('FeachaNacimiento: ', FechaNacimiento)
          console.log('FechaEmisión:', fechaEmision);

        }

        if (err) {
          setCode("");
          console.error(err);
        }
      }
    );
  }

  useEffect((deviceId) => {
    decodeContinuously(selectedDeviceId);
    console.log(`Started decode from camera with id ${selectedDeviceId}`);
  }, []);

  return (
    <main class="wrapper">
      <section className="container" id="demo-content">
        <div id="sourceSelectPanel">
          <label for="sourceSelect">Change video source:</label>
          <select
            id="sourceSelect"
            onChange={() => setSelectedDeviceId(sourceSelect.value)}
          >
            {videoInputDevices.map((element) => (
              <option value={element.deviceId}>{element.label}</option>
            ))}
          </select>
        </div>

        <div>
          <video id="video" width="100%" height="720px" />
        </div>

        <label>Result:</label>
        <pre>
          <code id="result">{code}</code>
        </pre>

        <button id="resetButton" onClick={() => resetClick()}>
          Reset
        </button>
      </section>
    </main>
  );
}
