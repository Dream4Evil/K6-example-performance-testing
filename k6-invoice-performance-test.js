import http from 'k6/http';
import { check } from "k6";
import "../libs/shim/core.js";
import encoding from 'k6/encoding';

//==================OPTIONS==================
export const options = {
  scenarios: {
    ramping_scenario: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 64,
      stages: [  
        { target: 1, duration: '1s' }, 
        { target: 2, duration: '2s' }, 
        { target: 2, duration: '4s' } 
      ],
    }
  }
};

const Request = Symbol.for("request");
postman[Symbol.for("initial")]({
  options
});

//==================MAIN FUNCTION==================
export default function() {
var randomNumber;
var maxNumber = 999999;
var minNumber = 1;
randomNumber = Math.floor(Math.random() *(maxNumber - minNumber) + minNumber);

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var hh = today.getHours();
var min = today.getMinutes();
var ss = today.getSeconds();
var mil = today.getMilliseconds();
today = yyyy + '/' + mm + '/' + dd + '/' + hh + '/' + min + '/' + ss + '/' + mil + '/' + randomNumber;

let today_no_slash = yyyy + mm + dd + hh + min + ss + mil;

var data = [];
var dataBase64 = [];
var bodySend = [];

today_no_slash = yyyy + mm + dd + hh + min + ss + mil;
data = `<Faktura xmlns="http://crd.gov.pl/wzor/2021/11/29/11089/" xmlns:etd="http://crd.gov.pl/xml/schematy/dziedzinowe/mf/2021/06/09/eD/DefinicjeTypy/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Naglowek>
    <KodFormularza kodSystemowy="FA (1)" wersjaSchemy="1-0E">FA</KodFormularza>
    <WariantFormularza>1</WariantFormularza>
    <DataWytworzeniaFa>2022-02-15T09:30:47Z</DataWytworzeniaFa>
    <SystemInfo>Samplofaktur</SystemInfo>
  </Naglowek>
  <Podmiot1>
    <DaneIdentyfikacyjne>
      <NIP>3810082698</NIP>
      <PelnaNazwa>ABC AGD sp. z o. o.</PelnaNazwa>
    </DaneIdentyfikacyjne>
    <Adres>
      <AdresPol>
        <KodKraju>PL</KodKraju>
        <Ulica>Kwiatowa</Ulica>
        <NrDomu>1</NrDomu>
        <NrLokalu>2</NrLokalu>
        <Miejscowosc>Warszawa</Miejscowosc>
        <KodPocztowy>00-001</KodPocztowy>
      </AdresPol>
    </Adres>
    <Email>abc@abc.pl</Email>
    <Telefon>667444555</Telefon>
  </Podmiot1>
  <Podmiot2>
    <DaneIdentyfikacyjne>
      <NIP>1111111111</NIP>
    </DaneIdentyfikacyjne>
  </Podmiot2>
  <Fa>
    <KodWaluty>PLN</KodWaluty>
    <P_1>2022-02-17</P_1>
    <P_2>FV2022/02/` + today_no_slash + `</P_2>
    <P_6>2022-01-03</P_6>
    <P_15>450</P_15>
    <Adnotacje>
      <P_16>2</P_16>
      <P_17>2</P_17>
      <P_18>2</P_18>
      <P_18A>2</P_18A>
      <P_19>2</P_19>
      <P_22>2</P_22>
      <P_23>2</P_23>
      <P_PMarzy>2</P_PMarzy>
    </Adnotacje>
    <RodzajFaktury>UPR</RodzajFaktury>
    <FaWiersze>
      <LiczbaWierszyFaktury>1</LiczbaWierszyFaktury>
      <WartoscWierszyFaktury1>0</WartoscWierszyFaktury1>
      <FaWiersz>
        <NrWierszaFa>1</NrWierszaFa>
        <P_7>wiertarka Wiertex mk5</P_7>
        <P_12>23</P_12>
      </FaWiersz>
    </FaWiersze>
  </Fa>
  <Stopka>
    <Informacje>
      <StopkaFaktury>Kapiał zakładowy 5 000 000</StopkaFaktury>
    </Informacje>
    <Rejestry>
      <KRS>0000099999</KRS>
      <REGON>999999999</REGON>
      <BDO>000099999</BDO>
    </Rejestry>
  </Stopka>
</Faktura>`;
dataBase64 = encoding.b64encode(data);


let priority = true;
bodySend = '{\r\n "highPriority": ' + priority + ',\r\n  "invoices": [\r\n       { \r\n "xml": \r\n"' + dataBase64 + '",\r\n "clientConfirmationType": 0,\r\n "clientConfirmationAddress": "string" \r\n } \r\n]\r\n}';

var apiKey = "4fc1276f-8921-4a4d-acde-ee4f0f973050";
var urlSend = "https://XXX/Send";

var paramsSend = { headers: { 'Content-Type': 'application/json', ApiKey: apiKey } }

//==================SENDING INVOICE - POST==================
const responses = http.post(urlSend, bodySend, paramsSend);

let succesfulResponseSendedMessage = "Import został zarejestrowany";
let succesInvoiceReceived = check(responses, {
  "Send invoice status is 200": r => r.status === 200,
  "Invoice is received": r => r.body.includes(succesfulResponseSendedMessage),
});
var message = responses.json().message;
console.log("End of number: " + today_no_slash);  
console.log("Respond message: " + message);  
console.log(responses); //Whole message
}
