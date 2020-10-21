import * as dotenv from 'dotenv';
import axios from 'axios';

const cod = `<cod><amount>123.00</amount><currency>PLN</currency></cod>`;

dotenv.config();
const { DPD_TEST_LOGIN, DPD_TEST_MASTERFIL, DPD_TEST_PASSWORD } = process.env;

export const createParcel = (
  company: string,
  address: string,
  postalCode: string,
  city: string,
  name: string,
  phone: number,
  cod: any,
) => {
  
  const value = `
  <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"> <S:Header/>
  <S:Body>
  <ns2:generatePackagesNumbersV1 xmlns:ns2="http://dpdservices.dpd.com.pl/"> <openUMLV1>
          <packages>
            <parcels>
              <content>Pyszna kawa</content>
              <sizeX>1</sizeX>
              <sizeY>2</sizeY> 
              <sizeZ>2</sizeZ> 
              <weight>3.2</weight>
            </parcels>
            <payerType>SENDER</payerType>
            <receiver>
              <address>${address}</address> 
              <city>${city}</city>
              <company>${company}</company> 
              <countryCode>PL</countryCode>
              <email></email>
              <name>${name}</name>
             <phone>${phone}</phone> 
             <postalCode>${postalCode}</postalCode>
            </receiver>
             <sender>
              <address>Ul. Lena 100</address>
              <city>Warszawa</city>
              <company>Sklep ABC</company>
              <countryCode>PL</countryCode>
              <email>pan@chcepaczke.pl</email>
              <fid>1495</fid>
              <name>Jan Kowalski</name>
              <phone>777777777</phone>
              <postalCode>02274</postalCode>
            </sender>
            <services>
              ${cod}
            </services>
          </packages>
 </openUMLV1> <pkgNumsGenerationPolicyV1>ALL_OR_NOTHING</pkgNumsGenerationPolicyV1> <authDataV1>
          <login>${DPD_TEST_LOGIN}</login>
          <masterFid>${DPD_TEST_MASTERFIL}</masterFid>
          <password>${DPD_TEST_PASSWORD}</password>
        </authDataV1>
      </ns2:generatePackagesNumbersV1>
    </S:Body>
  </S:Envelope>`;

  return axios
    .post(
      'https://dpdservicesdemo.dpd.com.pl/DPDPackageObjServicesService/DPDPackageObjServices?WSDL',
      value,
      { headers: { 'Content-Type': 'text/xml' } },
    )
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};
