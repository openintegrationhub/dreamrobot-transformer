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

  var lineItems_temp = [];

  msg.body.lineItems.forEach(function($value,$index)
  {
    lineItems_temp[$index] = {
      "id":             $index,
      "name":           $value.name,
      "sku":            $value.sku,
      "quantity":       jsonata(`$string("${$value.quantity}")`).evaluate(),
      "price":          jsonata(`$string("${$value.price}")`).evaluate(),
      "tax":            jsonata(`$string("${$value.taxAmount}")`).evaluate(),
      "transaction_id": $value.productId,
      "stock_align_id": $value.externalId
    }
  });

  const expression = {
    // oihApplicationRecords: [{
    //   recordUid: msg.body.order.id,
	// 	lastModification: {
    //   		type: 'created or modified',
	// 		timestamp: msg.body.order.date
	// 	}
    // }],
    order : {

      id: msg.body.oihApplicationRecords[0].recordUid,
      portal_account_id: undefined,
      platform: msg.body.references[0].externalApplicationName,
      current_date: undefined,
      customer: {
        id: undefined,
        username: msg.body.references[0].externalId,
        comment: msg.body.additionalInformation,
        vat_id: "",
        email: jsonata(`"${msg.body.customer.contactData}"[type='email'].value`).evaluate()
      }
      //   phone_1:  msg.body.customer.contactData[type='phone'][description='primary'].value,
      //   phone_2:  msg.body.customer.contactData[type='phone'][description='secondary'].value,
      //   fax:      msg.body.customer.contactData[type='fax'].value,
      //   address: {
      //     name:         msg.body.customer.displayName,
      //     name_2:       msg.body.customer.contactData[type='name'][description='Billing Name 2'].value,
      //     street:       msg.body.customer.addresses[0].street + " " + msg.body.customer.addresses[0].streetNumber,
      //     street_2:     msg.body.customer.addresses[0].unit,
      //     zip:          msg.body.customer.addresses[0].zipCode,
      //     city:         msg.body.customer.addresses[0].city,
      //     province:     msg.body.customer.addresses[0].region,
      //     country:      msg.body.customer.addresses[0].country,
      //     country_iso2: msg.body.customer.addresses[0].countryCode
      //   }
      // },
      // shipping: {
      //   fee:            msg.body.shipping.fee,
      //   date:           msg.body.shipping.date,
      //   deliverer:      msg.body.shipping.deliverer,
      //   code:           msg.body.shipping.code,
      //   method:         msg.body.shipping.method,
      //   address: {
      //     name:         msg.body.shipping.address.primaryContact,
      //     name_2:       msg.body.customer.contactData[type='name'][description='Shipping Name 2'].value,
      //     street:       msg.body.shipping.address.street + " " + msg.body.shipping.address.streetNumber,
      //     street_2:     msg.body.shipping.address.unit,
      //     zip:          msg.body.shipping.address.zipCode,
      //     city:         msg.body.shipping.address.city,
      //     province:     msg.body.shipping.address.region,
      //     country:      msg.body.shipping.address.country,
      //     country_iso2: msg.body.shipping.address.countryCode,
      //   }
      // },
      //  invoice_amount: jsonata(`$string("${msg.body.invoiceAmount}")`).evaluate()



      // pack_infos: msg.body.hiddenInfos,
      // infos: msg.body.information,
      // bill_url: msg.body.billUrl,
      // payment_method_id: msg.body.paymentMethodName,
      // invoice_number: msg.body.invoiceNumber,
      // paid_amount: msg.body.paidAmount ,
      // currency_id: msg.body.currency,
      // date: msg.body.startDate,
      // shipped_date: msg.body.endDate
       // status: {
       //   is_paid: msg.body.status[qualifier='paid'].value,
       //   paid_date: msg.body.status[qualifier='paid'].qualifiedOn ===  undefined ? "0000-00-00" : jsonata(`$fromMillis($toMillis("${msg.body.status[qualifier='paid'].qualifiedOn}"),'[Y0001]-[M01]-[D01]')`).evaluate()
         //   {
         //     qualifier: 'paid',
         //     value: jsonata(`$string("${msg.body.order.status.is_paid}")`).evaluate(),
         //     qualifiedOn: msg.body.order.status.paid_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${msg.body.order.status.paid_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
         //   }, {
         //     qualifier: 'parked',
         //     value: jsonata(`$string("${msg.body.order.status.is_parked}")`).evaluate(),
         //     qualifiedOn: undefined,
         //   }, {
         //     qualifier: 'initial_contact',
         //     value: jsonata(`$string("${msg.body.order.status.is_initial_contact}")`).evaluate(),
         //     qualifiedOn: msg.body.order.status.initial_contact_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${msg.body.order.status.initial_contact_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
         //   }, {
         //     qualifier: 'packed',
         //     value: jsonata(`$string("${msg.body.order.status.is_packed}")`).evaluate(),
         //     qualifiedOn: msg.body.order.status.packed_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${msg.body.order.status.packed_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
         //   }, {
         //     qualifier: 'shipped',
         //     value: jsonata(`$string("${msg.body.order.status.is_shipped}")`).evaluate(),
         //     qualifiedOn: msg.body.order.status.shipped_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${msg.body.order.status.shipped_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
         //   }, {
         //     qualifier: 'arrived',
         //     value: jsonata(`$string("${msg.body.order.status.is_arrived}")`).evaluate(),
         //     qualifiedOn: msg.body.order.status.arrived_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${msg.body.order.status.arrived_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
         //   }, {
         //     qualifier: 'cancelled',
         //     value: jsonata(`$string("${msg.body.order.status.is_cancelled}")`).evaluate(),
         //     qualifiedOn: msg.body.order.status.cancelled_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${msg.body.order.status.cancelled_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
         //   }, {
         //     qualifier: 'checkout',
         //     value: jsonata(`$string("${msg.body.order.status.is_checkout}")`).evaluate(),
         //     qualifiedOn: undefined
         //   }
       // },
      // references: [
      //   {
      //     externalId: msg.body.order.customer.username,
      //     externalApplicationName: msg.body.order.platform,
      //     description: ''
      //   },
      //   {
      //     externalId: msg.body.order.id,
      //     externalApplicationName: 'DreamRobot',
      //     description: ''
      //   }
      // ],
      // shipping:
      //     {
      //       fee: jsonata(`$number("${msg.body.order.shipping.fee}")`).evaluate(),
      //       feeCurrency: msg.body.order.currency_id,
      //       date: msg.body.order.shipping.date,
      //       deliverer: msg.body.order.shipping.deliverer,
      //       code: msg.body.order.shipping.code,
      //       method: msg.body.order.shipping.method,
      //       address: {
      //         street: msg.body.order.shipping.address.street === null ? undefined : jsonata(`$trim($substringBefore("${msg.body.order.shipping.address.street}", $split("${msg.body.order.shipping.address.street}", ' ')[-1]))`).evaluate(),
      //         streetNumber: msg.body.order.shipping.address.street === null ? undefined : jsonata(`$trim($split("${msg.body.order.shipping.address.street}", " ")[-1])`).evaluate(),
      //         unit: msg.body.order.shipping.address.street_2,
      //         zipCode: msg.body.order.shipping.address.zip,
      //         city: msg.body.order.shipping.address.city,
      //         district: '',
      //         region: msg.body.order.shipping.address.province,
      //         country: msg.body.order.shipping.address.country,
      //         countryCode: '',
      //         primaryContact: msg.body.order.shipping.address.name + ' ' + msg.body.order.shipping.address.name_2,
      //         label: 'primary'
      //       }
      //
      //     },
      //  line: lineItems_temp,
      // customer: {
      //   additionalInformation: msg.body.order.customer.comment,
      //   title: '',
      //   salutation: '',
      //   firstName: msg.body.order.customer.address.name === null ? undefined : jsonata(`$trim($substringBefore("${msg.body.order.customer.address.name}", $split("${msg.body.order.customer.address.name}", ' ')[-1]))`).evaluate(),
      //   middleName: '',
      //   lastName: msg.body.order.customer.address.name === null ? undefined : jsonata(`$trim($split("${msg.body.order.customer.address.name}", " ")[-1])`).evaluate(),
      //   gender: '',
      //   birthday: '',
      //   notes: '',
      //   displayName: msg.body.order.customer.address.name,
      //   language: '',
      //   nickname: '',
      //   jobTitle: '',
      //   photo: '',
      //   anniversary: '',
      //   addresses: [{
      //     street: msg.body.order.customer.address.street === null ? undefined : jsonata(`$trim($substringBefore("${msg.body.order.customer.address.street}", $split("${msg.body.order.customer.address.street}", ' ')[-1]))`).evaluate(),
      //     streetNumber: msg.body.order.customer.address.street === null ? undefined : jsonata(`$trim($split("${msg.body.order.customer.address.street}", " ")[-1])`).evaluate(),
      //     unit: msg.body.order.customer.address.street_2,
      //     zipCode: msg.body.order.customer.address.zip,
      //     city: msg.body.order.customer.address.city,
      //     district: '',
      //     region: msg.body.order.customer.address.province,
      //     country: msg.body.order.customer.address.country,
      //     countryCode: '',
      //     primaryContact: msg.body.order.customer.address.name + ' ' + msg.body.order.customer.address.name_2,
      //     label: 'primary'
      //   }],
      //   contactData: [{
      //     value: msg.body.order.customer.address.name_2,
      //     type: 'name',
      //     description: 'Billing Name 2'
      //   },
      //     {
      //       value: msg.body.order.shipping.address.name_2,
      //       type: 'name',
      //       description: 'Shipping Name 2'
      //     },
      //     {
      //       value: msg.body.order.customer.phone_1,
      //       type: 'phone',
      //       description: 'primary'
      //     },
      //     {
      //       value: msg.body.order.customer.phone_2,
      //       type: 'phone',
      //       description: 'secondary'
      //     },
      //     {
      //       value: msg.body.order.customer.fax,
      //       type: 'fax',
      //       description: 'primary'
      //     },
      //     {
      //       value: msg.body.order.customer.email,
      //       type: 'email',
      //       description: 'primary'
      //     }
      //   ],
      //   calendars: [],
      //   categories: []
      // }
    }
  };
  return expression;
};