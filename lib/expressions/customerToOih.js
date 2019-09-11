/**
 * Copyright 2018 DreamRobot GmbH
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const jsonata = require('jsonata');

module.exports.getExpression = msg => {
  if (Object.keys(msg.body.data).length === 0 && msg.body.data.constructor === Object) {
    return msg.body.data;
  }
  console.log('FLAG 1');
  const expression = {
    meta: {
      recordUid: msg.body.meta.recordUid,
      applicationUid: (msg.body.meta.applicationUid!=undefined && msg.body.meta.applicationUid!=null) ? msg.body.meta.applicationUid : 'appUid not set yet',
      iamToken: (msg.body.meta.iamToken!=undefined && msg.body.meta.iamToken!=null) ? msg.body.meta.iamToken : 'iamToken not set yet',
      lastModification: {
            type: 'created or modified',
            timestamp: msg.body.data.customer.date!=undefined ? msg.body.data.customer.date : Date(Date.now()).toString()
      },
      domainId: 'TO BE ADDED',
      schemaURI: 'TO BE ADDED'
    },
    data:{
      title:  '',
      salutation:  '',
      firstName:  msg.body.data.customer.address.name === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.data.customer.address.name}", $split("${ msg.body.data.customer.address.name}", ' ')[-1]))`).evaluate(),
      middleName: '',
      lastName:  msg.body.data.customer.address.name === null ? undefined : jsonata(`$trim($split("${ msg.body.data.customer.address.name}", " ")[-1])`).evaluate(),
      gender: '',
      birthday:  '',
      notes: '',
      displayName: msg.body.data.customer.address.name,
      language: '',
      nickname: '',
      jobTitle:  '',
      photo:  '',
      anniversary: '',
      addresses: [{
        street:  msg.body.data.customer.address.street === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.data.customer.address.street}", $split("${ msg.body.data.customer.address.street}", ' ')[-1]))`).evaluate(),
        streetNumber:  msg.body.data.customer.address.street === null ? undefined : jsonata(`$trim($split("${ msg.body.data.customer.address.street}", " ")[-1])`).evaluate(),
        unit: msg.body.data.customer.address.street_2,
        zipCode:  msg.body.data.customer.address.zip,
        city:  msg.body.data.customer.address.city,
        district: '',
        region:  '',
        country:  msg.body.data.customer.address.country,
        countryCode:  '',
        primaryContact: msg.body.data.customer.address.name + ' ' + msg.body.data.customer.address.name_2,
        description: 'primary'
      },{
        street:  msg.body.data.customer.shipping_address.street === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.data.customer.shipping_address.street}", $split("${ msg.body.data.customer.shipping_address.street}", ' ')[-1]))`).evaluate(),
        streetNumber:  msg.body.data.customer.shipping_address.street === null ? undefined : jsonata(`$trim($split("${ msg.body.data.customer.shipping_address.street}", " ")[-1])`).evaluate(),
        unit: msg.body.data.customer.shipping_address.street_2,
        zipCode:  msg.body.data.customer.shipping_address.zip,
        city:  msg.body.data.customer.shipping_address.city,
        district: '',
        region:  '',
        country:  msg.body.data.customer.shipping_address.country,
        countryCode:  '',
        primaryContact: msg.body.data.customer.shipping_address.name + ' ' + msg.body.data.customer.shipping_address.name_2,
        description: 'secondary'
      }],
      contactData: [{
        value:  msg.body.data.customer.address.name_2,
        type: 'name',
        description: 'Billing Name 2'
      },
      {
        value:  msg.body.data.customer.shipping_address.name_2,
        type: 'name',
        description: 'Shipping Name 2'
      },
      {
        value:  msg.body.data.customer.phone_1,
        type: 'phone',
        description: 'primary'
      },
      {
        value:  msg.body.data.customer.phone_2,
        type: 'phone',
        description: 'secondary'
      },
      {
        value:  msg.body.data.customer.fax,
        type: 'fax',
        description: 'primary'
      },
      {
        value:  msg.body.data.customer.email,
        type: 'email',
        description: 'primary'
      }
      ],
      calendars: [],
      categories: []
    }
  };
  console.log('FLAG 2');
  return expression;
};