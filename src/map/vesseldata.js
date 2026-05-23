drop table if exists routed_vessels;

create table routed_vessels (
  id text primary key,
  name text not null,
  route_id text not null references routes (id),
  speed_mps float8 not null,
  start_offset_seconds float8 not null,
  route_offset_meters float8 not null
);

insert into
  routed_vessels (
    id,
    name,
    route_id,
    speed_mps,
    start_offset_seconds,
    route_offset_meters
  )
values
  (
    'vessel-0001',
    'MV Atlas Horizon',
    'hormuz',
    50,
    0,
    -200
  ),
  (
    'vessel-0002',
    'SS Meridian Star',
    'hormuz',
    60,
    19000,
    200
  ),
  (
    'vessel-0003',
    'MV Pacific Ember',
    'hormuz',
    40,
    20000,
    -400
  ),
  (
    'vessel-0004',
    'SS Iron Current',
    'hormuz',
    75,
    57000,
    0
  ),
  (
    'vessel-0005',
    'MV Aurora Crest',
    'hormuz',
    80,
    64000,
    -900
  ),
  (
    'vessel-0006',
    'SS Northwind Voyager',
    'hormuz',
    40,
    28000,
    0
  ),
  (
    'vessel-0007',
    'MV Celestial Tide',
    'hormuz',
    50,
    69000,
    -300
  ),
  (
    'vessel-0008',
    'SS Blue Horizon',
    'hormuz',
    55,
    10000,
    -100
  ),
  (
    'vessel-0009',
    'MV Crimson Mariner',
    'hormuz',
    50,
    3000,
    420
  ),
  (
    'vessel-0010',
    'SS Golden Drift',
    'hormuz',
    50,
    8000,
    -210
  ),
  (
    'vessel-0011',
    'MV Sapphire Wave',
    'hormuz',
    55,
    19000,
    980
  ),
  (
    'vessel-0012',
    'SS Titan Voyager',
    'hormuz',
    50,
    7000,
    -530
  ),
  (
    'vessel-0013',
    'MV Ocean Sentinel',
    'hormuz',
    45,
    12000,
    610
  ),
  (
    'vessel-0014',
    'SS Arctic Falcon',
    'hormuz',
    50,
    51000,
    -870
  ),
  (
    'vessel-0015',
    'MV Lunar Crest',
    'hormuz',
    50,
    20000,
    300
  ),
  (
    'vessel-0016',
    'SS Voyager Spirit',
    'hormuz',
    50,
    15000,
    -440
  ),
  (
    'vessel-0017',
    'MV Neptune Arrow',
    'hormuz',
    50,
    9000,
    720
  ),
  (
    'vessel-0018',
    'SS Atlantic Ember',
    'hormuz',
    50,
    25000,
    -110
  ),
  (
    'vessel-0019',
    'MV Stormbreaker',
    'hormuz',
    50,
    21000,
    570
  ),
  (
    'vessel-0020',
    'SS Horizon Runner',
    'hormuz',
    50,
    35000,
    -960
  ),
  (
    'vessel-0021',
    'MV Silver Current',
    'hormuz',
    50,
    26000,
    140
  ),
  (
    'vessel-0022',
    'SS Emerald Voyager',
    'hormuz',
    55,
    15000,
    -320
  ),
  (
    'vessel-0023',
    'MV Ocean Phantom',
    'hormuz',
    50,
    1000,
    880
  ),
  (
    'vessel-0024',
    'SS Iron Mariner',
    'hormuz',
    50,
    32000,
    -540
  ),
  (
    'vessel-0025',
    'MV Polar Crest',
    'hormuz',
    50,
    42000,
    630
  ),
  (
    'vessel-0026',
    'SS Solar Drift',
    'hormuz',
    50,
    58000,
    -740
  ),
  (
    'vessel-0027',
    'MV Atlantic Voyager',
    'hormuz',
    50,
    68000,
    220
  ),
  (
    'vessel-0028',
    'SS Sapphire Wind',
    'hormuz',
    50,
    33000,
    -460
  ),
  (
    'vessel-0029',
    'MV Crimson Tide',
    'hormuz',
    50,
    22000,
    910
  ),
  (
    'vessel-0030',
    'SS Titan Horizon',
    'hormuz',
    50,
    41000,
    -180
  ),
  (
    'vessel-0031',
    'MV Ocean Quest',
    'hormuz',
    50,
    14000,
    340
  ),
  (
    'vessel-0032',
    'SS Northern Gale',
    'hormuz',
    50,
    9000,
    -510
  ),
  (
    'vessel-0033',
    'MV Aurora Dawn',
    'hormuz',
    50,
    37000,
    760
  ),
  (
    'vessel-0034',
    'SS Pacific Ranger',
    'hormuz',
    50,
    15000,
    -880
  ),
  (
    'vessel-0035',
    'MV Iron Voyager',
    'hormuz',
    50,
    6500,
    120
  ),
  (
    'vessel-0036',
    'SS Emerald Tide',
    'hormuz',
    50,
    500,
    -390
  ),
  (
    'vessel-0037',
    'MV Lunar Horizon',
    'hormuz',
    50,
    30000,
    840
  ),
  (
    'vessel-0038',
    'SS Neptune Crest',
    'hormuz',
    50,
    15000,
    -640
  ),
  (
    'vessel-0039',
    'MV Arctic Voyager',
    'hormuz',
    50,
    56000,
    500
  ),
  (
    'vessel-0040',
    'SS Ocean Spirit',
    'hormuz',
    50,
    30000,
    -970
  ),
  (
    'vessel-0041',
    'MV Celestial Mariner',
    'hormuz',
    50,
    8000,
    180
  ),
  (
    'vessel-0042',
    'SS Sapphire Crest',
    'hormuz',
    50,
    75000,
    -270
  ),
  (
    'vessel-0043',
    'MV Horizon Falcon',
    'hormuz',
    50,
    25000,
    690
  ),
  (
    'vessel-0044',
    'SS Golden Arrow',
    'hormuz',
    50,
    30000,
    -430
  ),
  (
    'vessel-0045',
    'MV Crimson Voyager',
    'hormuz',
    50,
    20000,
    930
  ),
  (
    'vessel-0046',
    'SS Atlantic Wind',
    'hormuz',
    50,
    15000,
    -160
  ),
  (
    'vessel-0047',
    'MV Storm Crest',
    'hormuz',
    50,
    60000,
    410
  ),
  (
    'vessel-0048',
    'SS Polar Horizon',
    'hormuz',
    50,
    80000,
    -720
  ),
  (
    'vessel-0049',
    'MV Titan Spirit',
    'hormuz',
    50,
    90000,
    250
  ),
  (
    'vessel-0050',
    'SS Voyager Tide',
    'hormuz',
    50,
    100000,
    -580
  ),
  (
    'vessel-0101',
    'MV Atlas Horizon',
    'greece',
    50,
    0,
    -200
  ),
  (
    'vessel-0102',
    'SS Meridian Star',
    'greece',
    60,
    19000,
    200
  ),
  (
    'vessel-0103',
    'MV Pacific Ember',
    'greece',
    40,
    20000,
    -400
  ),
  (
    'vessel-0104',
    'SS Iron Current',
    'greece',
    75,
    57000,
    0
  ),
  (
    'vessel-0105',
    'MV Aurora Crest',
    'greece',
    80,
    64000,
    -900
  ),
  (
    'vessel-0106',
    'SS Northwind Voyager',
    'greece',
    40,
    28000,
    0
  ),
  (
    'vessel-0107',
    'MV Celestial Tide',
    'greece',
    50,
    69000,
    -300
  ),
  (
    'vessel-0108',
    'SS Blue Horizon',
    'greece',
    55,
    10000,
    -100
  ),
  (
    'vessel-0109',
    'MV Crimson Mariner',
    'greece',
    50,
    3000,
    420
  ),
  (
    'vessel-0110',
    'SS Golden Drift',
    'greece',
    50,
    8000,
    -210
  ),
  (
    'vessel-0111',
    'MV Sapphire Wave',
    'greece',
    55,
    19000,
    980
  ),
  (
    'vessel-0112',
    'SS Titan Voyager',
    'greece',
    50,
    7000,
    -530
  ),
  (
    'vessel-0113',
    'MV Ocean Sentinel',
    'greece',
    45,
    12000,
    610
  ),
  (
    'vessel-0114',
    'SS Arctic Falcon',
    'greece',
    50,
    51000,
    -870
  ),
  (
    'vessel-0115',
    'MV Lunar Crest',
    'greece',
    50,
    20000,
    300
  ),
  (
    'vessel-0116',
    'SS Voyager Spirit',
    'greece',
    50,
    15000,
    -440
  ),
  (
    'vessel-0117',
    'MV Neptune Arrow',
    'greece',
    50,
    9000,
    720
  ),
  (
    'vessel-0118',
    'SS Atlantic Ember',
    'greece',
    50,
    25000,
    -110
  ),
  (
    'vessel-0119',
    'MV Stormbreaker',
    'greece',
    50,
    21000,
    570
  ),
  (
    'vessel-0120',
    'SS Horizon Runner',
    'greece',
    50,
    35000,
    -960
  ),
  (
    'vessel-0121',
    'MV Silver Current',
    'greece',
    50,
    26000,
    140
  ),
  (
    'vessel-0122',
    'SS Emerald Voyager',
    'greece',
    55,
    15000,
    -320
  ),
  (
    'vessel-0123',
    'MV Ocean Phantom',
    'greece',
    50,
    1000,
    880
  ),
  (
    'vessel-0124',
    'SS Iron Mariner',
    'greece',
    50,
    32000,
    -540
  ),
  (
    'vessel-0125',
    'MV Polar Crest',
    'greece',
    50,
    42000,
    630
  ),
  (
    'vessel-0126',
    'SS Solar Drift',
    'greece',
    50,
    58000,
    -740
  ),
  (
    'vessel-0127',
    'MV Atlantic Voyager',
    'greece',
    50,
    68000,
    220
  ),
  (
    'vessel-0128',
    'SS Sapphire Wind',
    'greece',
    50,
    33000,
    -460
  ),
  (
    'vessel-0129',
    'MV Crimson Tide',
    'greece',
    50,
    22000,
    910
  ),
  (
    'vessel-0130',
    'SS Titan Horizon',
    'greece',
    50,
    41000,
    -180
  ),
  (
    'vessel-0131',
    'MV Ocean Quest',
    'greece',
    50,
    14000,
    340
  ),
  (
    'vessel-0132',
    'SS Northern Gale',
    'greece',
    50,
    9000,
    -510
  ),
  (
    'vessel-0133',
    'MV Aurora Dawn',
    'greece',
    50,
    37000,
    760
  ),
  (
    'vessel-0134',
    'SS Pacific Ranger',
    'greece',
    50,
    15000,
    -880
  ),
  (
    'vessel-0135',
    'MV Iron Voyager',
    'greece',
    50,
    6500,
    120
  ),
  (
    'vessel-0136',
    'SS Emerald Tide',
    'greece',
    50,
    500,
    -390
  ),
  (
    'vessel-0137',
    'MV Lunar Horizon',
    'greece',
    50,
    30000,
    840
  ),
  (
    'vessel-0138',
    'SS Neptune Crest',
    'greece',
    50,
    15000,
    -640
  ),
  (
    'vessel-0139',
    'MV Arctic Voyager',
    'greece',
    50,
    56000,
    500
  ),
  (
    'vessel-0140',
    'SS Ocean Spirit',
    'greece',
    50,
    30000,
    -970
  ),
  (
    'vessel-0141',
    'MV Celestial Mariner',
    'greece',
    50,
    8000,
    180
  ),
  (
    'vessel-0142',
    'SS Sapphire Crest',
    'greece',
    50,
    75000,
    -270
  ),
  (
    'vessel-0143',
    'MV Horizon Falcon',
    'greece',
    50,
    25000,
    690
  ),
  (
    'vessel-0144',
    'SS Golden Arrow',
    'greece',
    50,
    30000,
    -430
  ),
  (
    'vessel-0145',
    'MV Crimson Voyager',
    'greece',
    50,
    20000,
    930
  ),
  (
    'vessel-0146',
    'SS Atlantic Wind',
    'greece',
    50,
    15000,
    -160
  ),
  (
    'vessel-0147',
    'MV Storm Crest',
    'greece',
    50,
    60000,
    410
  ),
  (
    'vessel-0148',
    'SS Polar Horizon',
    'greece',
    50,
    80000,
    -720
  ),
  (
    'vessel-0149',
    'MV Titan Spirit',
    'greece',
    50,
    90000,
    250
  ),
  (
    'vessel-0150',
    'SS Voyager Tide',
    'greece',
    50,
    100000,
    -580
  ),
    (
    'vessel-0201',
    'MV Atlas Horizon',
    'india',
    50,
    0,
    -200
  ),
  (
    'vessel-0202',
    'SS Meridian Star',
    'india',
    60,
    19000,
    200
  ),
  (
    'vessel-0203',
    'MV Pacific Ember',
    'india',
    40,
    20000,
    -400
  ),
  (
    'vessel-0204',
    'SS Iron Current',
    'india',
    75,
    57000,
    0
  ),
  (
    'vessel-0205',
    'MV Aurora Crest',
    'india',
    80,
    64000,
    -900
  ),
  (
    'vessel-0206',
    'SS Northwind Voyager',
    'india',
    40,
    28000,
    0
  ),
  (
    'vessel-0207',
    'MV Celestial Tide',
    'india',
    50,
    69000,
    -300
  ),
  (
    'vessel-0208',
    'SS Blue Horizon',
    'india',
    55,
    10000,
    -100
  ),
  (
    'vessel-0209',
    'MV Crimson Mariner',
    'india',
    50,
    3000,
    420
  ),
  (
    'vessel-0210',
    'SS Golden Drift',
    'india',
    50,
    8000,
    -210
  ),
  (
    'vessel-0211',
    'MV Sapphire Wave',
    'india',
    55,
    19000,
    980
  ),
  (
    'vessel-0212',
    'SS Titan Voyager',
    'india',
    50,
    7000,
    -530
  ),
  (
    'vessel-0213',
    'MV Ocean Sentinel',
    'india',
    45,
    12000,
    610
  ),
  (
    'vessel-0214',
    'SS Arctic Falcon',
    'india',
    50,
    51000,
    -870
  ),
  (
    'vessel-0215',
    'MV Lunar Crest',
    'india',
    50,
    20000,
    300
  ),
  (
    'vessel-0216',
    'SS Voyager Spirit',
    'india',
    50,
    15000,
    -440
  ),
  (
    'vessel-0217',
    'MV Neptune Arrow',
    'india',
    50,
    9000,
    720
  ),
  (
    'vessel-0218',
    'SS Atlantic Ember',
    'india',
    50,
    25000,
    -110
  ),
  (
    'vessel-0219',
    'MV Stormbreaker',
    'india',
    50,
    21000,
    570
  ),
  (
    'vessel-0220',
    'SS Horizon Runner',
    'india',
    50,
    35000,
    -960
  ),
  (
    'vessel-0221',
    'MV Silver Current',
    'india',
    50,
    26000,
    140
  ),
  (
    'vessel-0222',
    'SS Emerald Voyager',
    'india',
    55,
    15000,
    -320
  ),
  (
    'vessel-0223',
    'MV Ocean Phantom',
    'india',
    50,
    1000,
    880
  ),
  (
    'vessel-0224',
    'SS Iron Mariner',
    'india',
    50,
    32000,
    -540
  ),
  (
    'vessel-0225',
    'MV Polar Crest',
    'india',
    50,
    42000,
    630
  ),
  (
    'vessel-0226',
    'SS Solar Drift',
    'india',
    50,
    58000,
    -740
  ),
  (
    'vessel-0227',
    'MV Atlantic Voyager',
    'india',
    50,
    68000,
    220
  ),
  (
    'vessel-0228',
    'SS Sapphire Wind',
    'india',
    50,
    33000,
    -460
  ),
  (
    'vessel-0229',
    'MV Crimson Tide',
    'india',
    50,
    22000,
    910
  ),
  (
    'vessel-0230',
    'SS Titan Horizon',
    'india',
    50,
    41000,
    -180
  ),
  (
    'vessel-0231',
    'MV Ocean Quest',
    'india',
    50,
    14000,
    340
  ),
  (
    'vessel-0232',
    'SS Northern Gale',
    'india',
    50,
    9000,
    -510
  ),
  (
    'vessel-0233',
    'MV Aurora Dawn',
    'india',
    50,
    37000,
    760
  ),
  (
    'vessel-0234',
    'SS Pacific Ranger',
    'india',
    50,
    15000,
    -880
  ),
  (
    'vessel-0235',
    'MV Iron Voyager',
    'india',
    50,
    6500,
    120
  ),
  (
    'vessel-0236',
    'SS Emerald Tide',
    'india',
    50,
    500,
    -390
  ),
  (
    'vessel-0237',
    'MV Lunar Horizon',
    'india',
    50,
    30000,
    840
  ),
  (
    'vessel-0238',
    'SS Neptune Crest',
    'india',
    50,
    15000,
    -640
  ),
  (
    'vessel-0239',
    'MV Arctic Voyager',
    'india',
    50,
    56000,
    500
  ),
  (
    'vessel-0240',
    'SS Ocean Spirit',
    'india',
    50,
    30000,
    -970
  ),
  (
    'vessel-0241',
    'MV Celestial Mariner',
    'india',
    50,
    8000,
    180
  ),
  (
    'vessel-0242',
    'SS Sapphire Crest',
    'india',
    50,
    75000,
    -270
  ),
  (
    'vessel-0243',
    'MV Horizon Falcon',
    'india',
    50,
    25000,
    690
  ),
  (
    'vessel-0244',
    'SS Golden Arrow',
    'india',
    50,
    30000,
    -430
  ),
  (
    'vessel-0245',
    'MV Crimson Voyager',
    'india',
    50,
    20000,
    930
  ),
  (
    'vessel-0246',
    'SS Atlantic Wind',
    'india',
    50,
    15000,
    -160
  ),
  (
    'vessel-0247',
    'MV Storm Crest',
    'india',
    50,
    60000,
    410
  ),
  (
    'vessel-0248',
    'SS Polar Horizon',
    'india',
    50,
    80000,
    -720
  ),
  (
    'vessel-0249',
    'MV Titan Spirit',
    'india',
    50,
    90000,
    250
  ),
  (
    'vessel-0250',
    'SS Voyager Tide',
    'india',
    50,
    100000,
    -580
  ),
    (
    'vessel-0301',
    'MV Atlas Horizon',
    'new york',
    50,
    0,
    -200
  ),
  (
    'vessel-0302',
    'SS Meridian Star',
    'new york',
    60,
    19000,
    200
  ),
  (
    'vessel-0303',
    'MV Pacific Ember',
    'new york',
    40,
    20000,
    -400
  ),
  (
    'vessel-0304',
    'SS Iron Current',
    'new york',
    75,
    57000,
    0
  ),
  (
    'vessel-0305',
    'MV Aurora Crest',
    'new york',
    80,
    64000,
    -900
  ),
  (
    'vessel-0306',
    'SS Northwind Voyager',
    'new york',
    40,
    28000,
    0
  ),
  (
    'vessel-0307',
    'MV Celestial Tide',
    'new york',
    50,
    69000,
    -300
  ),
  (
    'vessel-0308',
    'SS Blue Horizon',
    'new york',
    55,
    10000,
    -100
  ),
  (
    'vessel-0309',
    'MV Crimson Mariner',
    'new york',
    50,
    3000,
    420
  ),
  (
    'vessel-0310',
    'SS Golden Drift',
    'new york',
    50,
    8000,
    -210
  ),
  (
    'vessel-0311',
    'MV Sapphire Wave',
    'new york',
    55,
    19000,
    980
  ),
  (
    'vessel-0312',
    'SS Titan Voyager',
    'new york',
    50,
    7000,
    -530
  ),
  (
    'vessel-0313',
    'MV Ocean Sentinel',
    'new york',
    45,
    12000,
    610
  ),
  (
    'vessel-0314',
    'SS Arctic Falcon',
    'new york',
    50,
    51000,
    -870
  ),
  (
    'vessel-0315',
    'MV Lunar Crest',
    'new york',
    50,
    20000,
    300
  ),
  (
    'vessel-0316',
    'SS Voyager Spirit',
    'new york',
    50,
    15000,
    -440
  ),
  (
    'vessel-0317',
    'MV Neptune Arrow',
    'new york',
    50,
    9000,
    720
  ),
  (
    'vessel-0318',
    'SS Atlantic Ember',
    'new york',
    50,
    25000,
    -110
  ),
  (
    'vessel-0319',
    'MV Stormbreaker',
    'new york',
    50,
    21000,
    570
  ),
  (
    'vessel-0320',
    'SS Horizon Runner',
    'new york',
    50,
    35000,
    -960
  ),
  (
    'vessel-0321',
    'MV Silver Current',
    'new york',
    50,
    26000,
    140
  ),
  (
    'vessel-0322',
    'SS Emerald Voyager',
    'new york',
    55,
    15000,
    -320
  ),
  (
    'vessel-0323',
    'MV Ocean Phantom',
    'new york',
    50,
    1000,
    880
  ),
  (
    'vessel-0324',
    'SS Iron Mariner',
    'new york',
    50,
    32000,
    -540
  ),
  (
    'vessel-0325',
    'MV Polar Crest',
    'new york',
    50,
    42000,
    630
  ),
  (
    'vessel-0326',
    'SS Solar Drift',
    'new york',
    50,
    58000,
    -740
  ),
  (
    'vessel-0327',
    'MV Atlantic Voyager',
    'new york',
    50,
    68000,
    220
  ),
  (
    'vessel-0328',
    'SS Sapphire Wind',
    'new york',
    50,
    33000,
    -460
  ),
  (
    'vessel-0329',
    'MV Crimson Tide',
    'new york',
    50,
    22000,
    910
  ),
  (
    'vessel-0330',
    'SS Titan Horizon',
    'new york',
    50,
    41000,
    -180
  ),
  (
    'vessel-0331',
    'MV Ocean Quest',
    'new york',
    50,
    14000,
    340
  ),
  (
    'vessel-0332',
    'SS Northern Gale',
    'new york',
    50,
    9000,
    -510
  ),
  (
    'vessel-0333',
    'MV Aurora Dawn',
    'new york',
    50,
    37000,
    760
  ),
  (
    'vessel-0334',
    'SS Pacific Ranger',
    'new york',
    50,
    15000,
    -880
  ),
  (
    'vessel-0335',
    'MV Iron Voyager',
    'new york',
    50,
    6500,
    120
  ),
  (
    'vessel-0336',
    'SS Emerald Tide',
    'new york',
    50,
    500,
    -390
  ),
  (
    'vessel-0337',
    'MV Lunar Horizon',
    'new york',
    50,
    30000,
    840
  ),
  (
    'vessel-0338',
    'SS Neptune Crest',
    'new york',
    50,
    15000,
    -640
  ),
  (
    'vessel-0339',
    'MV Arctic Voyager',
    'new york',
    50,
    56000,
    500
  ),
  (
    'vessel-0340',
    'SS Ocean Spirit',
    'new york',
    50,
    30000,
    -970
  ),
  (
    'vessel-0341',
    'MV Celestial Mariner',
    'new york',
    50,
    8000,
    180
  ),
  (
    'vessel-0342',
    'SS Sapphire Crest',
    'new york',
    50,
    75000,
    -270
  ),
  (
    'vessel-0343',
    'MV Horizon Falcon',
    'new york',
    50,
    25000,
    690
  ),
  (
    'vessel-0344',
    'SS Golden Arrow',
    'new york',
    50,
    30000,
    -430
  ),
  (
    'vessel-0345',
    'MV Crimson Voyager',
    'new york',
    50,
    20000,
    930
  ),
  (
    'vessel-0346',
    'SS Atlantic Wind',
    'new york',
    50,
    15000,
    -160
  ),
  (
    'vessel-0347',
    'MV Storm Crest',
    'new york',
    50,
    60000,
    410
  ),
  (
    'vessel-0348',
    'SS Polar Horizon',
    'new york',
    50,
    80000,
    -720
  ),
  (
    'vessel-0349',
    'MV Titan Spirit',
    'new york',
    50,
    90000,
    250
  ),
  (
    'vessel-0350',
    'SS Voyager Tide',
    'new york',
    50,
    100000,
    -580
  )
  ;