import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const { DPD_TEST_LOGIN, DPD_TEST_MASTERFIL, DPD_TEST_PASSWORD } = process.env;

export const createProtocol = sessionId => {
  const value = `
  <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"> <S:Header/>
  <S:Body>
  <ns2:generateProtocolV1 xmlns:ns2="http://dpdservices.dpd.com.pl/"> <dpdServicesParamsV1>
          <pickupAddress>
            <fid>1495</fid>
  </pickupAddress> <policy>IGNORE_ERRORS</policy> <session>
            ${sessionId}
            <sessionType>DOMESTIC</sessionType>
          </session>
  </dpdServicesParamsV1> <outputDocFormatV1>PDF</outputDocFormatV1> <outputDocPageFormatV1>LBL_PRINTER</outputDocPageFormatV1> <authDataV1>
          <login>${DPD_TEST_LOGIN}</login>
          <masterFid>${DPD_TEST_MASTERFIL}</masterFid>
          <password>${DPD_TEST_PASSWORD}</password>
  </authDataV1>
  57
  </ns2:generateProtocolV1>
    </S:Body>
  </S:Envelope>
`;

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
