import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const { DPD_LOGIN, DPD_PASSWORD, DPD_CHANNEL } = process.env;

export const infoService = waybill => {
  const value = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:even="http://events.dpdinfoservices.dpd.com.pl/">
    <soapenv:Header/>
    <soapenv:Body>
    <even:getEventsForWaybillV1>
    <waybill>${waybill}</waybill>
    <eventsSelectType>ONLY_LAST</eventsSelectType>
    <language>PL</language>
    <authDataV1>
    <channel>${DPD_CHANNEL}</channel>
    <login>${DPD_LOGIN}</login>
    <password>${DPD_PASSWORD}</password>
    </authDataV1>
    </even:getEventsForWaybillV1>
    </soapenv:Body>
    </soapenv:Envelope>`;

  return axios
    .post(
      'https://dpdinfoservices.dpd.com.pl/DPDInfoServicesObjEventsService/DPDInfoServicesObjEvents?wsdl',
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
