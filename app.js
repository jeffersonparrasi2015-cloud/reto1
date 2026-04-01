const API_KEY = "AIzaSyCNYvCj-Q6PhK3BFbB75c6zIueEVyePrbw";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Feedback");

  const timestamp = new Date();
  const producto = data.producto;
  const comentario = data.comentario;
  const nombre = data.nombre || "Anónimo";

  // IA
  const resultadoIA = analizarConGemini(comentario);

  sheet.appendRow([
    timestamp,
    producto,
    comentario,
    nombre,
    resultadoIA.sentimiento,
    resultadoIA.resumen
  ]);

  return ContentService.createTextOutput("OK");
}function analizarConGemini(texto) {

  const prompt = `
Analiza el siguiente comentario y responde SOLO en JSON:

{
  "sentimiento": "Positivo, Neutro o Negativo",
  "resumen": "Resumen corto"
}

Comentario: ${texto}
`;

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + API_KEY;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  const text = json.candidates[0].content.parts[0].text;

  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      sentimiento: "Error",
      resumen: "No se pudo procesar"
    };
  }
}