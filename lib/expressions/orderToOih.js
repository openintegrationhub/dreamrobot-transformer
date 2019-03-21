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

  msg.body.order.line.forEach(function($value,$index)
  {
    lineItems_temp[$index] = {
      "name":         $value.name,
      "sku":          $value.sku,
      "quantity":     jsonata(`$number("${$value.quantity}")`).evaluate(),
      "price":        jsonata(`$number("${$value.price}")`).evaluate(),
      "taxAmount":    jsonata(`$number("${$value.tax}")`).evaluate(),
      "productId":    $value.transaction_id,
      "references": [
        {
          "externalId":               $value.stock_align_id,
          "externalApplicationName":  "dreamrobot_stock_id",
          "description":              ""
        }
      ]
    }
  });

  const expression = {
    oihApplicationRecords: [{
      recordUid: msg.body.order.id,
		lastModification: {
      		type: 'created or modified',
			timestamp: msg.body.order.date
		}
    }],
    invoiceAmount:            jsonata(`$number("${msg.body.order.invoice_amount}")`).evaluate(),
    orderNumber:              msg.body.order.id,
    hiddenInfos:              msg.body.order.pack_infos,
    information:              msg.body.order.infos,
    additionalInformation:    msg.body.order.customer.comment,
    billUrl:                  jsonata(`$string("${msg.body.order.bill_url}")`).evaluate(),
    paymentMethodName:        msg.body.order.payment_method_id,
    invoiceNumber:            msg.body.order.invoice_number === "" ? 0 : jsonata(`$number("${msg.body.order.invoice_number}")`).evaluate(),
    paidAmount:               msg.body.order.paid_amount === "" ? 0 : jsonata(`$number("${msg.body.order.paid_amount}")`).evaluate(),
    currency:                 msg.body.order.currency_id,
    startDate:                msg.body.order.date,
    endDate:                  msg.body.order.shipped_date,
    status: [
      {
      qualifier:              'paid',
      value:                  jsonata(`$string("${msg.body.order.status.is_paid}")`).evaluate(),
      qualifiedOn:            msg.body.order.status.paid_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${ msg.body.order.status.paid_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
      },{
      qualifier:              'parked',
      value:                  jsonata(`$string("${msg.body.order.status.is_parked}")`).evaluate(),
      qualifiedOn:            undefined,
      },{
      qualifier:              'initial_contact',
      value:                  jsonata(`$string("${msg.body.order.status.is_initial_contact}")`).evaluate(),
      qualifiedOn:            msg.body.order.status.initial_contact_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${ msg.body.order.status.initial_contact_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
      },{
      qualifier:              'packed',
      value:                  jsonata(`$string("${msg.body.order.status.is_packed}")`).evaluate(),
      qualifiedOn:            msg.body.order.status.packed_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${ msg.body.order.status.packed_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
      },{
      qualifier:              'shipped',
      value:                  jsonata(`$string("${msg.body.order.status.is_shipped}")`).evaluate(),
      qualifiedOn:            msg.body.order.status.shipped_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${ msg.body.order.status.shipped_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
      },{
      qualifier:              'arrived',
      value:                  jsonata(`$string("${msg.body.order.status.is_arrived}")`).evaluate(),
      qualifiedOn:            msg.body.order.status.arrived_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${ msg.body.order.status.arrived_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
      },{
      qualifier:              'cancelled',
      value:                  jsonata(`$string("${msg.body.order.status.is_cancelled}")`).evaluate(),
      qualifiedOn:            msg.body.order.status.cancelled_date === "0000-00-00" ? undefined : jsonata(`$fromMillis($toMillis("${ msg.body.order.status.cancelled_date}",'[Y0001]-[M01]-[D01]'))`).evaluate(),
      },{
      qualifier:              'checkout',
      value:                  jsonata(`$string("${msg.body.order.status.is_checkout}")`).evaluate(),
      qualifiedOn:            undefined
      }
    ],
    references: [
      {
        externalId:               msg.body.order.customer.username,
        externalApplicationName:  msg.body.order.platform,
        description:              ''
      },
      {
        externalId:               msg.body.order.id,
        externalApplicationName:  'DreamRobot',
        description:              ''
      }
    ],
    shipping:
      {
        fee:                  jsonata(`$number("${msg.body.order.shipping.fee}")`).evaluate(),
        feeCurrency:          msg.body.order.currency_id,
        date:                 msg.body.order.shipping.date,
        deliverer:            msg.body.order.shipping.deliverer,
        code:                 msg.body.order.shipping.code,
        method:               msg.body.order.shipping.method,
        address: {
          street:             msg.body.order.shipping.address.street === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.order.shipping.address.street}", $split("${ msg.body.order.shipping.address.street}", ' ')[-1]))`).evaluate(),
          streetNumber:       msg.body.order.shipping.address.street === null ? undefined : jsonata(`$trim($split("${ msg.body.order.shipping.address.street}", " ")[-1])`).evaluate(),
          unit:               msg.body.order.shipping.address.street_2,
          zipCode:            msg.body.order.shipping.address.zip,
          city:               msg.body.order.shipping.address.city,
          district:           '',
          region:             msg.body.order.shipping.address.province,
          country:            msg.body.order.shipping.address.country,
          countryCode:        '',
          primaryContact:     msg.body.order.shipping.address.name + ' ' + msg.body.order.shipping.address.name_2,
          label:              'primary'
        }

      },
    // lineItems:                jsonata(`each("${msg.body.order.line}", function($value) {
   	// 	{
    //     	"name": $value.name,
    //         "sku":  $value.sku,
    //         "quantity": $value.quantity,
    //         "price":         $value.price,
    //         "taxAmount":     $value.tax,
    //         "productId":     $value.transaction_id,
    //         "references": [
    //           {
    //             "externalId":               $value.stock_align_id,
    //             "externalApplicationName":  "dreamrobot_stock_id",
    //             "description":              ""
    //           }
    //         ]
    //     }
	// })`).evaluate(),
        lineItems:              lineItems_temp  ,
    customer: {
      title: '',
      salutation: '',
      firstName: msg.body.order.customer.address.name === null ? undefined : jsonata(`$trim($substringBefore("${msg.body.order.customer.address.name}", $split("${msg.body.order.customer.address.name}", ' ')[-1]))`).evaluate(),
      middleName: '',
      lastName: msg.body.order.customer.address.name === null ? undefined : jsonata(`$trim($split("${msg.body.order.customer.address.name}", " ")[-1])`).evaluate(),
      gender: '',
      birthday: '',
      notes: '',
      displayName: msg.body.order.customer.address.name,
      language: '',
      nickname: '',
      jobTitle: '',
      photo: '',
      anniversary: '',
      addresses:[{
          street:             msg.body.order.customer.address.street === null ? undefined : jsonata(`$trim($substringBefore("${ msg.body.order.customer.address.street}", $split("${ msg.body.order.customer.address.street}", ' ')[-1]))`).evaluate(),
          streetNumber:       msg.body.order.customer.address.street === null ? undefined : jsonata(`$trim($split("${ msg.body.order.customer.address.street}", " ")[-1])`).evaluate(),
          unit:               msg.body.order.customer.address.street_2,
          zipCode:            msg.body.order.customer.address.zip,
          city:               msg.body.order.customer.address.city,
          district:           '',
          region:             msg.body.order.customer.address.province,
          country:            msg.body.order.customer.address.country,
          countryCode:        '',
          primaryContact:     msg.body.order.customer.address.name + ' ' + msg.body.order.customer.address.name_2,
          label:              'primary'
      }],
      contactData: [{
        value: msg.body.order.customer.address.name_2,
        type: 'name',
        description: 'Billing Name 2'
      },
        {
          value: msg.body.order.shipping.address.name_2,
          type: 'name',
          description: 'Shipping Name 2'
        },
        {
          value: msg.body.order.customer.phone_1,
          type: 'phone',
          description: 'primary'
        },
        {
          value: msg.body.order.customer.phone_2,
          type: 'phone',
          description: 'secondary'
        },
        {
          value: msg.body.order.customer.fax,
          type: 'fax',
          description: 'primary'
        },
        {
          value: msg.body.order.customer.email,
          type: 'email',
          description: 'primary'
        }
      ],
      calendars: [],
      categories: []
    }
  };
  return expression;
};