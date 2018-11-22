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
  if (Object.keys(msg.body).length === 0 && msg.body.constructor === Object) {
    return msg.body;
  }
  const expression = {
    oihUid: '',
    oihCreated: '',
    oihLastModified: '',
    oihApplicationRecords: [{
      applicationUid: msg.body.user_id,
      recordUid: msg.body.customer.id
    }],
    title:  '',
    salutation:  '',
    firstName:  msg.body.customer.address.name === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.customer.address.name}", $split("${ msg.body.customer.address.name}", ' ')[-1]))`).evaluate(),
    middleName: '',
    lastName:  msg.body.customer.address.name === null ? undefined : jsonata(`$trim($split("${ msg.body.customer.address.name}", " ")[-1])`).evaluate(),
    gender: '',
    birthday:  '',
    notes: '',
    displayName: msg.body.customer.address.name,
    language: '',
    nickname: '',
    jobTitle:  '',
    photo:  '',
    anniversary: '',
    addresses: [{
      street:  msg.body.customer.address.street === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.customer.address.street}", $split("${ msg.body.customer.address.street}", ' ')[-1]))`).evaluate(),
      streetNumber:  msg.body.customer.address.street === null ? undefined : jsonata(`$trim($split("${ msg.body.customer.address.street}", " ")[-1])`).evaluate(),
      unit: msg.body.customer.address.street_2,
      zipCode:  msg.body.customer.address.zip,
      city:  msg.body.customer.address.city,
      district: '',
      region:  '',
      country:  msg.body.customer.address.country,
      countryCode:  '',
      primaryContact: msg.body.customer.address.name & ' ' & msg.body.customer.address.name_2,
      description: 'primary'
    },{
       street:  msg.body.customer.shipping_address.street === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.customer.shipping_address.street}", $split("${ msg.body.customer.shipping_address.street}", ' ')[-1]))`).evaluate(),
      streetNumber:  msg.body.customer.shipping_address.street === null ? undefined : jsonata(`$trim($split("${ msg.body.customer.shipping_address.street}", " ")[-1])`).evaluate(),
      unit: msg.body.customer.shipping_address.street_2,
      zipCode:  msg.body.customer.shipping_address.zip,
      city:  msg.body.customer.shipping_address.city,
      district: '',
      region:  '',
      country:  msg.body.customer.shipping_address.country,
      countryCode:  '',
      primaryContact: msg.body.customer.shipping_address.name & ' ' & msg.body.customer.shipping_address.name_2,
      description: 'secondary'
    }],
    contactData: [{
      value:  msg.body.customer.address.name_2,
      type: 'name',
      description: 'Billing Name 2'
    },
    {
      value:  msg.body.customer.shipping_address.name_2,
      type: 'name',
      description: 'Shipping Name 2'
    },
    {
      value:  msg.body.customer.phone_1,
      type: 'phone',
      description: 'primary'
    },
    {
      value:  msg.body.customer.phone_2,
      type: 'phone',
      description: 'secondary'
    },
    {
      value:  msg.body.customer.fax,
      type: 'fax',
      description: 'primary'
    },
    {
      value:  msg.body.customer.email,
      type: 'email',
      description: 'primary'
    }
    ],
    calendars: [],
    categories: []
  };
  return expression;
};