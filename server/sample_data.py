import datetime

long_lorem_ipsum = ''
short_lorem_ipsum = ''

sample_data = {}

sample_data['list_text_assets'] = {
    'list_id': 3,
    'list_items': [
        {
            '_id': 1,
            'text': short_lorem_ipsum
        },
        {
            '_id': 2,
            'text': short_lorem_ipsum
        }
    ],
}

sample_data['text_assets'] = [
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': 'Company A',
    'status': 'Closed',
    'shipTo': 'Francisco Pérez-Olaeta',
    'orderTotal': 2490.0,
    'orderDate': datetime.datetime.now(),
    'id': 1,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyA.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': 'Company B',
    'status': 'Closed',
    'shipTo': 'Soo Jung Lee',
    'orderTotal': 1760.0,
    'orderDate': datetime.datetime.now(),
    'id': 2
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': 'Company C',
    'status': 'Shipped',
    'shipTo': 'Run Liu',
    'orderTotal': 665.0,
    'orderDate': datetime.datetime.now(),
    'id': 3,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyC.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': "Company D",
    'status': "Shipped",
    'shipTo': "Soo Jung Lee",
    'orderTotal': 560.0,
    'orderDate': datetime.datetime.now(),
    'id': 4,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyD.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': "Company E",
    'status': "New",
    'shipTo': "John Rodman",
    'orderTotal': 810.0,
    'orderDate': datetime.datetime.now(),
    'id': 5,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyE.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': "Company F",
    'status': "New",
    'shipTo': "Elizabeth Andersen",
    'orderTotal': 196.5,
    'orderDate': datetime.datetime.now(),
    'id': 6,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyF.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': "Company G",
    'status': "Closed",
    'shipTo': "Peter Krschne",
    'orderTotal': 270.0,
    'orderDate': datetime.datetime.now(),
    'id': 7,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyG.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': "Company H",
    'status': "Closed",
    'shipTo': "Sven Mortensen",
    'orderTotal': 736.0,
    'orderDate': datetime.datetime.now(),
    'id': 8,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyH.svg'
  },
  {
    'shortDescription': short_lorem_ipsum,
    'longDescription': long_lorem_ipsum,
    'title': "Company I",
    'status': "Shipped",
    'shipTo': "Anna Bedecs",
    'orderTotal': 800.0,
    'orderDate': datetime.datetime.now(),
    'id': 9,
    'imageSrc':'https://wtsrepository.blob.core.windows.net/sampledata/CompanyI.svg'
  }
]
