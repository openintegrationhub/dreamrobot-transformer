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
    oihApplicationRecords: [{
      recordUid: msg.body.order.id,
		lastModification: {
      		type: 'created or modified',
			timestamp: msg.body.order.date
		}
    }],
    invoiceAmount:            msg.body.order.invoice_amount + 0 ,
    orderNumber:              msg.body.order.id,
    hiddenInfos:              msg.body.order.pack_infos,
    information:              msg.body.order.infos,
    additionalInformation:    msg.body.order.customer.comment,
    billUrl:                  msg.body.order.bill_url,
    paymentMethodName:        msg.body.order.payment_method_id,
    invoiceNumber:            msg.body.order.invoice_number,
    paidAmount:               msg.body.order.paid_amount,
    currency:                 msg.body.order.currency_id,
    startDate:                msg.body.order.date,
    endDate:                  msg.body.order.shipped_date,
    status: [
      {
      qualifier:              'paid',
      value:                  msg.body.order.status.is_paid,
      qualifiedOn:            msg.body.order.status.paid_date,
      },{
      qualifier:              'parked',
      value:                  msg.body.order.status.is_parked,
      qualifiedOn:            '0000-00-00',
      },{
      qualifier:              'initial_contact',
      value:                  msg.body.order.status.is_initial_contact,
      qualifiedOn:            msg.body.order.status.initial_contact_date,
      },{
      qualifier:              'packed',
      value:                  msg.body.order.status.is_packed,
      qualifiedOn:            msg.body.order.status.packed_date,
      },{
      qualifier:              'shipped',
      value:                  msg.body.order.status.is_shipped,
      qualifiedOn:            msg.body.order.status.shipped_date,
      },{
      qualifier:              'arrived',
      value:                  msg.body.order.status.is_arrived,
      qualifiedOn:            msg.body.order.status.arrived_date,
      },{
      qualifier:              'cancelled',
      value:                  msg.body.order.status.is_cancelled,
      qualifiedOn:            msg.body.order.status.cancelled_date,
      },{
      qualifier:              'checkout',
      value:                  msg.body.order.status.is_checkout,
      qualifiedOn:           '0000-00-00'
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
        fee:                  msg.body.order.shipping.fee,
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
    lineItems:                jsonata(`$map("${msg.body.order.line}", function($line, $index, $dataset) {
   		{
        	"name": $line.name,
            "sku":  $line.sku,
            "quantity": $line.quantity,
            "price":         $line.price,
            "taxAmount":     $line.tax,
            "productId":     $line.transaction_id,
            "references": [
              {
                "externalId":               $line.stock_align_id,
                "externalApplicationName":  "dreamrobot_stock_id",
                "description":              ""
              }
            ]
        }
	})`).evaluate(),
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