const campoCidade = document.getElementById("cidade");
const botaoBuscar = document.getElementById("buscar");
const botaoLimpar = document.getElementById("limpar");
const resultado = document.getElementById("resultado");

botaoBuscar.addEventListener("click", async () => {
  const cidade = campoCidade.value.trim();

  if (!cidade) {
    alert("Por favor, digite o nome de uma cidade.");
    return;
  }

  resultado.innerHTML = "Buscando informações...";
  resultado.className = "card"; // reset estilo

  try {
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultado.innerHTML = "Cidade não encontrada.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=America/Sao_Paulo`;
    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      resultado.innerHTML = "Não foi possível obter o clima atual.";
      return;
    }

    const { temperature, windspeed } = weatherData.current_weather;

    let emoji = "🌤";
    if (temperature >= 30) emoji = "☀️";
    else if (temperature < 20) emoji = "🌧";

    const mensagem = `${emoji} Em ${name}, ${country}, a temperatura atual é de ${temperature}°C e o vento está a ${windspeed} km/h.`;

    resultado.innerHTML = `<strong>${mensagem}</strong>`;

    // Estilo visual com base na temperatura
    if (temperature >= 30) {
      resultado.style.backgroundColor = "#ffe5e5"; // quente
    } else if (temperature < 20) {
      resultado.style.backgroundColor = "#e0f0ff"; // frio
    } else {
      resultado.style.backgroundColor = "#e5ffe5"; // ameno
    }

  } catch (error) {
    console.error(error);
    resultado.innerHTML = "Erro ao buscar informações. Tente novamente.";
  }
});

botaoLimpar.addEventListener("click", () => {
  campoCidade.value = "";
  resultado.innerHTML = "";
  resultado.style.backgroundColor = "";
});
