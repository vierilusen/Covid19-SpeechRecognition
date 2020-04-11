let url = 'https://api.kawalcorona.com/indonesia/provinsi/';

//Fetching Data From Api
fetch(url)
  .then((resp) => {
    if (!resp.ok) {
      if (resp.status >= 400 && resp.status < 500) {
        return resp.json().then((data) => {
          let err = { errorMessage: data.message };
          throw err;
        });
      } else {
        let err = { errorMessage: 'Please try again in some time, Server Error!' };
        throw err;
      }
    }
    return resp.json();
  })
  .then((data) => {
    generateVariabel(data);
  })


//Get Data From Api
const generateVariabel = (dataCovid19) => {
  const kasus = dataCovid19;
  const btn = document.querySelector(".button");
  const content = document.querySelector(".content");
  const hasil = document.querySelector(".hasil")
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  btn.addEventListener('click', () => {
    recognition.start();
  });

  //Function to activated Speech Recognition
  recognition.onstart = function () {
    hasil.innerHTML = "Voice is activated";
  };

  //Function to result voice
  recognition.onresult = function (event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    readOutLoud(transcript);
  };

  //Function to get and proses voice
  const readOutLoud = (message) => {
    const speech = new SpeechSynthesisUtterance();

    //Keyword city for identification message
    const cityKeywordsArray = ["Jakarta", "Jawa Barat", "Banten", "Jawa Timur", "Jawa Tengah", "Sulawesi Selatan", "Bali", "Yogyakarta", "Kalimantan Timur", "Sumatera Utara", "Papua", "Kalimantan Tengah", "Sumatera Barat", "Kalimantan Selatan", "Sumatera Selatan", "Kalimantan Utara", "Riau", "Lampung", "Kalimantan Barat", "Nusa Tenggara Barat", "Kepulauan Riau", "Sulawesi Tenggara", "Aceh", "Sulawesi Utara", "Sulawesi Tengah", "Jambi", "Bengkulu", "Kepulauan Bangka Belitung", "Sulawesi Barat", "Papua Barat", "Maluku", "Maluku Utara", "Gorontalo"];

    //Get city keyword
    let getCityKeywords = cityKeywordsArray.map(hasil => "coronavirus " + hasil).some(city => city == message);


    //Replace keyword for Filter before proses
    const replaceKeywords = message.replace("coronavirus ", "").replace("Jakarta", "DKI Jakarta").replace("Yogyakarta", "Daerah Istimewa Yogyakarta")

    //Get final Message
    const finalMessage = kasus
      .filter(kota => kota.attributes.Provinsi == replaceKeywords)
      .map(result => "Positif: " + result.attributes.Kasus_Posi + ", Sembuh: " + result.attributes.Kasus_Semb + ", Meninggal: " + result.attributes.Kasus_Meni);

    //Check Message and Database Api
    if (message = getCityKeywords) {
      speech.text = finalMessage;
    } else {
      speech.text = 'Data tidak ditemukan, silahkan coba lagi!';
    }


    hasil.innerHTML = speech.text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = 'id';

    window.speechSynthesis.speak(speech);
  }
}



