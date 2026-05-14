import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import Papa from 'papaparse';

// Default data - will be replaced when CSV is uploaded
const defaultData = [
{"deal":"S-001/A","month":"Feb-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":15460},
{"deal":"O - 001/25","month":"Jan-25","agent":"AKHLESH MISHRA","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":14000},
{"deal":"O - 002/25","month":"Jan-25","agent":"SONILA SHERIFI","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":4000},
{"deal":"O - 005/25","month":"Jan-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":74500},
{"deal":"O - 005/25A","month":"Jan-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":24999.97},
{"deal":"O - 007/25","month":"Jan-25","agent":"ANKESH MISHRA","manager":"NOT APPLICABLE","director":"SUBROTO BANERJEE","commission":407880},
{"deal":"O - 017/25","month":"Feb-25","agent":"NOURHAN AMER MELIGYMOHAMED","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":62915.52},
{"deal":"O - 015/25","month":"Feb-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":7500},
{"deal":"O - 016/25","month":"Feb-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":10500},
{"deal":"O - 019/25","month":"Feb-25","agent":"MUKESH RAWAT","manager":"NOT APPLICABLE","director":"MOHAMED ELSAYED","commission":10250},
{"deal":"O - 021/25","month":"Feb-25","agent":"MERIEM ISSALMANE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":29400},
{"deal":"O - 022/25","month":"Feb-25","agent":"NAJI KADDOURA","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":30000},
{"deal":"O - 023/25","month":"Feb-25","agent":"MERIEM ISSALMANE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":242195.52},
{"deal":"O - 024/25","month":"Feb-25","agent":"SHAAM ALZOABI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":83555.52},
{"deal":"O - 025/25","month":"Feb-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":123392.5},
{"deal":"O - 026/25","month":"Feb-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":53329},
{"deal":"O - 027/25","month":"Feb-25","agent":"LUSINE MIKAELIAN","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":27599.78},
{"deal":"O - 028/25","month":"Feb-25","agent":"NIHAD MADIDI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":161880},
{"deal":"O - 029/25","month":"Feb-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":375000},
{"deal":"O - 030/25","month":"Feb-25","agent":"DARREN CHRIS MONTEIRO","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":22128.88},
{"deal":"O - 030A/25","month":"Feb-25","agent":"DARREN CHRIS MONTEIRO","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":22128.88},
{"deal":"O - 031/25","month":"Feb-25","agent":"NEETA KISHINCHAND TARANI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":95150},
{"deal":"O - 032/25","month":"Feb-25","agent":"SELBI GURBANVA","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":42500},
{"deal":"S-002/25","month":"Jan-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":24420},
{"deal":"S - 002/25","month":"Jan-25","agent":"AISHA LUYIMA","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":20831.8},
{"deal":"S - 009/25","month":"Jan-25","agent":"AYAZ ALI","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":31500},
{"deal":"S-004/A","month":"Mar-25","agent":"AYAZ ALI","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":5150},
{"deal":"S-004","month":"Feb-25","agent":"AYAZ ALI","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":15202.8},
{"deal":"S - 003/25","month":"Feb-25","agent":"MOHAMMED TAHA","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":11500},
{"deal":"S-001","month":"Feb-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":5000},
{"deal":"S - 006/25","month":"Feb-25","agent":"JAYA NARESH BHARWANI","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":82000},
{"deal":"S - 008/25","month":"Feb-25","agent":"JOSEPH MICHAEL CARTER","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":36460},
{"deal":"S - 007/25","month":"Feb-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":13920.03},
{"deal":"S - 007A/25","month":"Feb-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":6666.51},
{"deal":"S - 010/25","month":"Jan-25","agent":"Ayaz Ali","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":5000},
{"deal":"O - 033/25","month":"Mar-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":32500},
{"deal":"O - 038/25","month":"Mar-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":17714},
{"deal":"O - 034/25","month":"Mar-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":42160},
{"deal":"O - 040/25","month":"Mar-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":181900},
{"deal":"O - 041/25A","month":"Mar-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":43459.29},
{"deal":"O - 041/25AA","month":"Mar-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":43459.29},
{"deal":"O - 041/25B","month":"Mar-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":8435.07},
{"deal":"O - 041/25BB","month":"Mar-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":42175.35},
{"deal":"O - 042/25","month":"Mar-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":374257.76},
{"deal":"O - 042A/25","month":"Mar-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":374257.76},
{"deal":"O - 043/25","month":"Mar-25","agent":"DARREN CHRIS MONTEIRO","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":49955.52},
{"deal":"O - 044/25","month":"Mar-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":43000},
{"deal":"O - 045/25","month":"Mar-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":30500},
{"deal":"O - 046/25","month":"Mar-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":37800},
{"deal":"O - 047/25","month":"Mar-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":73775},
{"deal":"O - 048/25","month":"Mar-25","agent":"SONILA SHERIFI","manager":"NOT APPLICABLE","director":"MOHAMED ELSAYED","commission":17400},
{"deal":"O - 049/25","month":"Mar-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":26960.05},
{"deal":"O - 049/25 A","month":"Mar-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":26960.05},
{"deal":"O - 050/25","month":"Mar-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":21500},
{"deal":"O - 051/25","month":"Mar-25","agent":"ZARINA AITMAGAMBETOVA","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":61394.4},
{"deal":"S - 012/25","month":"Mar-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":47500},
{"deal":"S - 013/25","month":"Mar-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":39880},
{"deal":"S - 013/25A","month":"Mar-25","agent":"SCOTT CAELAN SKELLY","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":8809.51},
{"deal":"S - 014/25","month":"Mar-25","agent":"JOSEPH MICHAEL CARTER","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":21540},
{"deal":"S - 015/25","month":"Mar-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":9000},
{"deal":"S - 015/25A","month":"Mar-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":9000},
{"deal":"S - 016/25","month":"Mar-25","agent":"DANTE PENNIECOOKE","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":5000.4},
{"deal":"O - 056/25","month":"Apr-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":173000},
{"deal":"O - 057/25","month":"Apr-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":64200},
{"deal":"O - 058/25","month":"Apr-25","agent":"KAVYAMBIKA SURESH MANGALORE","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":4280},
{"deal":"O - 059/25","month":"Apr-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":20425.42},
{"deal":"O - 059 A/25","month":"Apr-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":20425.42},
{"deal":"O - 060/25","month":"Apr-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":20425.42},
{"deal":"O - 060A/25","month":"Apr-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":20425.42},
{"deal":"O - 061/25","month":"Apr-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":237250},
{"deal":"O - 062/25","month":"Apr-25","agent":"ZARINA AITMAGAMBETOVA","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":14900},
{"deal":"O - 063/25","month":"Apr-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":48280},
{"deal":"O - 064/25","month":"Apr-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":33450},
{"deal":"O - 065/25","month":"Apr-25","agent":"AKHLESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":6500},
{"deal":"O - 066/25","month":"Apr-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":84341.34},
{"deal":"O - 068/25","month":"Apr-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":17420},
{"deal":"O - 069/25","month":"Apr-25","agent":"MOHAMMED AZEEM","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":42925.14},
{"deal":"O - 071/25","month":"Apr-25","agent":"HIND DARDAOUI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":41880},
{"deal":"O - 071/25A","month":"Apr-25","agent":"HIND DARDAOUI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":27920},
{"deal":"O - 072/25","month":"Apr-25","agent":"HIND DARDAOUI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":102600},
{"deal":"O - 073/25","month":"Apr-25","agent":"MOHSIN ALI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":40200},
{"deal":"O - 073/25A","month":"Apr-25","agent":"MOHSIN ALI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":26800},
{"deal":"O - 074/25","month":"Apr-25","agent":"MUHAMMAD MANSOOR AHMED","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":63672},
{"deal":"O - 074/25A","month":"Apr-25","agent":"MUHAMMAD MANSOOR AHMED","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":42448},
{"deal":"O - 075/25","month":"Apr-25","agent":"MUHAMMAD MANSOOR AHMED","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":40008},
{"deal":"O - 075/25A","month":"Apr-25","agent":"MUHAMMAD MANSOOR AHMED","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":26672},
{"deal":"O - 076/25","month":"Apr-25","agent":"HIND DARDAOUI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":39912},
{"deal":"O - 076/25A","month":"Apr-25","agent":"HIND DARDAOUI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":26608},
{"deal":"O - 077/25","month":"Apr-25","agent":"HIND DARDAOUI","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":51420},
{"deal":"O - 079/25","month":"Apr-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":9856},
{"deal":"O - 080/25","month":"Apr-25","agent":"MEHMET EMIR GULLUOGLU","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":85191.4},
{"deal":"O - 083/25","month":"Apr-25","agent":"MOHAMMAD FURQAN","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":84110.5},
{"deal":"O - 084/25","month":"Apr-25","agent":"MERIEM ISSALMANE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":114277.76},
{"deal":"O - 084/25A","month":"Apr-25","agent":"MERIEM ISSALMANE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":114277.76},
{"deal":"S - 011/25","month":"Apr-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":5000},
{"deal":"S - 017/25","month":"Apr-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":26800},
{"deal":"S - 018/25","month":"Apr-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":34500},
{"deal":"S - 018/25A","month":"Apr-25","agent":"AISHA LUYIMA","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":34500},
{"deal":"S - 019/25","month":"Apr-25","agent":"JAYA NARESH BHARWANI","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":66000},
{"deal":"S - 020/25","month":"Apr-25","agent":"JOSEPH MICHAEL CARTER","manager":"NOT APPLICABLE","director":"SHAUN CULLEN","commission":15900},
{"deal":"S - 021/25","month":"Apr-25","agent":"JOSEPH MICHAEL CARTER","manager":"NOT APPLICABLE","director":"SHAUN CULLEN","commission":13220},
{"deal":"S - 022/25","month":"Apr-25","agent":"JOSEPH MICHAEL CARTER","manager":"NOT APPLICABLE","director":"SHAUN CULLEN","commission":13200},
{"deal":"S - 023/25","month":"Apr-25","agent":"SCOTT CAELAN SKELLY","manager":"NOT APPLICABLE","director":"SHAUN CULLEN","commission":18980},
{"deal":"S - 024/25","month":"Apr-25","agent":"SCOTT CAELAN SKELLY","manager":"NOT APPLICABLE","director":"SHAUN CULLEN","commission":14200},
{"deal":"S - 025/25","month":"Apr-25","agent":"SCOTT CAELAN SKELLY","manager":"NOT APPLICABLE","director":"SHAUN CULLEN","commission":19300},
{"deal":"S - 026/25","month":"Apr-25","agent":"JOSEPH MICHAEL CARTER","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":81000},
{"deal":"S - 026A/25","month":"Apr-25","agent":"JOSEPH MICHAEL CARTER","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":37500},
{"deal":"S - 028/25","month":"Apr-25","agent":"MELTEM CIVELEK","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":15000},
{"deal":"S - 027/25","month":"Apr-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"SHAUN CULLEN","commission":5000},
{"deal":"O - 103/25","month":"May-25","agent":"SHAAM ALZOABI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":92700},
{"deal":"S - 093/25","month":"May-25","agent":"SEBASTIAN HOPPE","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":6500},
{"deal":"O - 105/25","month":"May-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":25378.07},
{"deal":"O - 105/25A","month":"May-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":25378.07},
{"deal":"O - 096/25","month":"May-25","agent":"ROZHAN GERAMI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":2625},
{"deal":"O - 086/25","month":"May-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":397555.52},
{"deal":"O - 087/25","month":"May-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":397395.52},
{"deal":"O - 089/25","month":"May-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":98317.76},
{"deal":"O - 089/25A","month":"May-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":98317.76},
{"deal":"S - 095/25","month":"May-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":5000},
{"deal":"S - 098/25","month":"May-25","agent":"NASRELDIN ATEF AHMED ALY AHMED","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":7179.05},
{"deal":"O - 090/25","month":"May-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":68568},
{"deal":"O - 090/25A","month":"May-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":45712},
{"deal":"O - 106/25","month":"May-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":1000},
{"deal":"O - 107/25","month":"May-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":1000},
{"deal":"O - 085/25","month":"May-25","agent":"MOHIT CHHABRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":116617.76},
{"deal":"O - 085/25A","month":"May-25","agent":"MOHIT CHHABRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":116617.76},
{"deal":"O - 091/25","month":"May-25","agent":"MOHIT CHHABRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":74709.5},
{"deal":"O - 100/25","month":"May-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":28319.44},
{"deal":"O - 100/25A","month":"May-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":37539.76},
{"deal":"O - 101/25","month":"May-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":12825},
{"deal":"O - 108/25","month":"May-25","agent":"MELTEM CIVELEK","manager":"ROZITA ABBAS POUR ZANJANI","director":"MOHAMED ELSAYED","commission":8250},
{"deal":"O - 099/25","month":"May-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":15000},
{"deal":"O - 102/25","month":"May-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":67200},
{"deal":"O - 104/25","month":"May-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":60080},
{"deal":"O - 097/25","month":"May-25","agent":"ETHAR HASSAN IBRAHIM HASSAN","manager":"SYED DANISH HAIDER","director":"MOHAMED ELSAYED","commission":25000},
{"deal":"O - 110/25","month":"May-25","agent":"ASMA CHENITI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":60000},
{"deal":"S - 094/25","month":"May-25","agent":"AISHA LUYIMA","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":7961.9},
{"deal":"S - 094/25","month":"May-25","agent":"AISHA LUYIMA","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":14285.94},
{"deal":"O - 111/25","month":"May-25","agent":"STEPHANIE SHUANG","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":44020.7},
{"deal":"O - 111/25A","month":"May-25","agent":"STEPHANIE SHUANG","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":44020.7},
{"deal":"O - 113/25","month":"May-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":369638},
{"deal":"O - 113/25A","month":"May-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":369638},
{"deal":"O - 117/25","month":"Jun-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":19261.42},
{"deal":"O - 117/25A","month":"Jun-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":19261.42},
{"deal":"S - 118/25","month":"Jun-25","agent":"AYAZ ALI","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":3900},
{"deal":"O - 119/25","month":"Jun-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":28737.92},
{"deal":"O - 119/25A","month":"Jun-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":28737.92},
{"deal":"O - 121/25","month":"Jun-25","agent":"HIBILDAS HARIDAS","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":8500},
{"deal":"O -122/25","month":"Jun-25","agent":"HIBILDAS HARIDAS","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":4000},
{"deal":"O -123/25","month":"Jun-25","agent":"RAJDEEP SINGH","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":101094.88},
{"deal":"O - 124/25","month":"Jun-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":18500},
{"deal":"S - 125/25","month":"Jun-25","agent":"JAYA NARESH BHARWANI","manager":"JORDAN LEE LIVERMORE","director":"MOHAMED ELSAYED","commission":123809.52},
{"deal":"O - 126/25","month":"Jun-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":332689.71},
{"deal":"O - 126/25A","month":"Jun-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":332689.71},
{"deal":"O - 127/25","month":"Jun-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":332689.71},
{"deal":"O - 127/25A","month":"Jun-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":332689.71},
{"deal":"O - 128/25","month":"Jun-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":83596.52},
{"deal":"O - 130/25","month":"Jul-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":123287.91},
{"deal":"O - 130/25A","month":"Jul-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":123287.91},
{"deal":"O - 131/25","month":"Jul-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":129400},
{"deal":"O - 132/25","month":"Jul-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":85759.62},
{"deal":"O - 133/25","month":"Jul-25","agent":"SAURABH CHUGH","manager":"SUBROTO BANERJEE","director":"SUBROTO BANERJEE","commission":86918.58},
{"deal":"O - 134/25","month":"Jul-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":21000},
{"deal":"O - 135/25","month":"Jul-25","agent":"COLIN GODWIN SANTHWAN","manager":"ROZITA ABBAS POUR ZANJANI","director":"MOHAMED ELSAYED","commission":11896.83},
{"deal":"O - 135/25A","month":"Jul-25","agent":"COLIN GODWIN SANTHWAN","manager":"ROZITA ABBAS POUR ZANJANI","director":"MOHAMED ELSAYED","commission":35690.49},
{"deal":"O - 136/25","month":"Jul-25","agent":"ANKESH MISHRA","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":24500},
{"deal":"O - 137/25","month":"Jul-25","agent":"MUKESH RAWAT","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":59500},
{"deal":"O - 139/25","month":"Jul-25","agent":"MUHAMMAD MANSOOR AHMED","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":69154.86},
{"deal":"O - 140/25","month":"Jul-25","agent":"HIND DARDAOUI","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":13300},
{"deal":"O - 141/25","month":"Jul-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":7750},
{"deal":"O - 142/25","month":"Jul-25","agent":"MOHAMMED AZEEM","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":100000},
{"deal":"O - 143/25","month":"Jul-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":58300},
{"deal":"O - 144/25","month":"Jul-25","agent":"HIND DARDAOUI","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":12100},
{"deal":"O - 145/25","month":"Jul-25","agent":"MERIEM ISSALMANE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":191715.52},
{"deal":"O - 146/25","month":"Jul-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":17500},
{"deal":"O - 147/25","month":"Jul-25","agent":"KAVYAMBIKA SURESH MANGALORE","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":3000.11},
{"deal":"O - 148/25","month":"Jul-25","agent":"MALIK RASHID ALI","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":2857.2},
{"deal":"O - 149/25","month":"Jul-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":164540},
{"deal":"O - 150/25","month":"Jul-25","agent":"NEETA KISHINCHAND TARANI","manager":"ROZITA ABBAS POUR ZANJANI","director":"MOHAMED ELSAYED","commission":34879.95},
{"deal":"O - 151/25","month":"Aug-25","agent":"MALIK RASHID ALI","manager":"SUBROTO BANERJEE","director":"MOHAMED ELSAYED","commission":5714.29},
{"deal":"O - 152/25","month":"Aug-25","agent":"NEETA KISHINCHAND TARANI","manager":"ROZITA ABBAS POUR ZANJANI","director":"MOHAMED ELSAYED","commission":35119.96},
{"deal":"S - 153/25","month":"Aug-25","agent":"JAYDAB BHOWMIK","manager":"NADIM","director":"MOHAMED ELSAYED","commission":5000},
{"deal":"S - 154/25","month":"Aug-25","agent":"RUBY ROSE RAPIS","manager":"NADIM","director":"MOHAMED ELSAYED","commission":6150},
{"deal":"S - 155/25","month":"Aug-25","agent":"SANDEEP MAZZARI","manager":"NADIM","director":"MOHAMED ELSAYED","commission":7250},
{"deal":"O -156/25","month":"Aug-25","agent":"CHIDINMA MARYJANE OKEKE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":23000},
{"deal":"O -158/25","month":"Aug-25","agent":"COLIN GODWIN SANTHWAN","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":50926.55},
{"deal":"O -159/25","month":"Aug-25","agent":"TAREK AHMED MOHARAM HASSAN SALEH","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":5500},
{"deal":"O -160/25","month":"Aug-25","agent":"HIND DARDAOUI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":13800},
{"deal":"S -161/25","month":"Aug-25","agent":"TAMARA CREEK","manager":"NADIM","director":"MOHAMED ELSAYED","commission":1000.04},
{"deal":"O -162/25","month":"Aug-25","agent":"HIND DARDAOUI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":11200},
{"deal":"S -163/25","month":"Aug-25","agent":"JAYA NARESH BHARWANI","manager":"NADIM","director":"MOHAMED ELSAYED","commission":15000},
{"deal":"S -170/25","month":"Aug-25","agent":"AISHA LUYIMA","manager":"NADIM","director":"MOHAMED ELSAYED","commission":6100},
{"deal":"O -171/25","month":"Sep-25","agent":"AKHLESH MISHRA","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":4750},
{"deal":"O - 180/25","month":"Sep-25","agent":"ARASH HADDAD MOMENI","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":68875},
{"deal":"O - 180/25A","month":"Sep-25","agent":"ARASH HADDAD MOMENI","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":68875},
{"deal":"O - 173/25","month":"Sep-25","agent":"HIND DARDAOUI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":13600},
{"deal":"O - 178/25","month":"Sep-25","agent":"NATALIA DASHYAN","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":48009.24},
{"deal":"O - 178/25A","month":"Sep-25","agent":"NATALIA DASHYAN","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":48009.24},
{"deal":"O - 181/25","month":"Sep-25","agent":"NOURHAN AMER MELIGYMOHAMED","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":115800},
{"deal":"O - 177/25","month":"Sep-25","agent":"RAJDEEP SINGH","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":13397.81},
{"deal":"O - 177/25A","month":"Sep-25","agent":"RAJDEEP SINGH","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":13397.83},
{"deal":"O - 177/25B","month":"Sep-25","agent":"RAJDEEP SINGH","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":26795.6},
{"deal":"S -172/25","month":"Sep-25","agent":"TAMARA CREEK","manager":"NADIM","director":"MOHAMED ELSAYED","commission":1950},
{"deal":"O - 175/25","month":"Sep-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":16500},
{"deal":"O - 176/25","month":"Sep-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":12500},
{"deal":"O - 182/25","month":"Sep-25","agent":"ANKESH MISHRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":12571},
{"deal":"O - 182/25A","month":"Sep-25","agent":"AKHLESH MISHRA","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":12571},
{"deal":"O - 183/25","month":"Sep-25","agent":"ANKESH MISHRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":26350},
{"deal":"O - 184/25","month":"Sep-25","agent":"MIRA CHAAR","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":72555.52},
{"deal":"O - 185/25","month":"Sep-25","agent":"SYED DANISH HAIDER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":43842},
{"deal":"O - 186/25","month":"Sep-25","agent":"HIND DARDAOUI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":22000},
{"deal":"O - 187/25","month":"Sep-25","agent":"SYED DANISH HAIDER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":43820},
{"deal":"O - 188/25","month":"Sep-25","agent":"SYED DANISH HAIDER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":62740},
{"deal":"O - 189/25","month":"Sep-25","agent":"MALIK RASHID ALI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":15600},
{"deal":"O - 190/25","month":"Sep-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":67599.95},
{"deal":"S - 191/25","month":"Sep-25","agent":"RUBY ROSE RAPIS","manager":"NADIM","director":"MOHAMED ELSAYED","commission":5250},
{"deal":"O - 192/25","month":"Sep-25","agent":"MUKESH RAWAT","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":75000},
{"deal":"O - 193/25","month":"Sep-25","agent":"SYED DANISH HAIDER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":32263.8},
{"deal":"O - 194/25","month":"Sep-25","agent":"MAYANK","manager":"NOT APPLICABLE","director":"MOHAMED ELSAYED","commission":21800},
{"deal":"O - 195/25","month":"Sep-25","agent":"AVISHEK","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":42000},
{"deal":"O - 203/25","month":"Sep-25","agent":"MUKESH RAWAT","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":5600},
{"deal":"O - 204/25","month":"Oct-25","agent":"KRISTINA DRONINA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":20600},
{"deal":"S - 205/25","month":"Oct-25","agent":"JAYA NARESH BHARWANI","manager":"NADIM","director":"MOHAMED ELSAYED","commission":82200},
{"deal":"S - 206/25","month":"Oct-25","agent":"JAYA NARESH BHARWANI","manager":"NADIM","director":"MOHAMED ELSAYED","commission":82200},
{"deal":"S - 207/25","month":"Oct-25","agent":"RUBY ROSE RAPIS","manager":"NADIM","director":"MOHAMED ELSAYED","commission":61020},
{"deal":"O - 208/25","month":"Oct-25","agent":"MERIEM ISSALMANE","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":656240},
{"deal":"O - 209/25","month":"Oct-25","agent":"MOHAMMAD BILAL MAZAR","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":32500},
{"deal":"O - 210/25","month":"Oct-25","agent":"EVGENIIA TASHKINOVA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":37376.74},
{"deal":"O - 210/25A","month":"Oct-25","agent":"EVGENIIA TASHKINOVA","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":37376.74},
{"deal":"O - 211/25","month":"Oct-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":15000},
{"deal":"O - 212/25","month":"Oct-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":174500},
{"deal":"O - 213/25","month":"Oct-25","agent":"STEPHANIE SHUANG","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":1229880},
{"deal":"O - 214/25","month":"Oct-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":43012.2},
{"deal":"O - 215/25","month":"Oct-25","agent":"ANKESH MISHRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":21000},
{"deal":"O - 216/25","month":"Oct-25","agent":"MUKESH RAWAT","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":57000},
{"deal":"O - 217/25","month":"Oct-25","agent":"RAJA ASAD","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":6750},
{"deal":"O - 218/25","month":"Oct-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":13000},
{"deal":"O - 219/25","month":"Oct-25","agent":"RAJDEEP SINGH","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":42758},
{"deal":"O - 220/25","month":"Nov-25","agent":"RAJA ASAD","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":3238},
{"deal":"O - 221/25","month":"Nov-25","agent":"ANKESH MISHRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":75000},
{"deal":"O - 222/25","month":"Nov-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":77924.45},
{"deal":"S - 223/25","month":"Nov-25","agent":"MAHMOUD TAHA","manager":"NADIM","director":"MOHAMED ELSAYED","commission":13785.71},
{"deal":"S - 224/25","month":"Nov-25","agent":"RUBY ROSE RAPIS","manager":"NADIM","director":"MOHAMED ELSAYED","commission":14000},
{"deal":"O - 225/25","month":"Nov-25","agent":"SHAAM ALZOABI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":63400},
{"deal":"O - 226/25","month":"Nov-25","agent":"SYED DANISH HAIDER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":59000},
{"deal":"O - 227/25","month":"Nov-25","agent":"SAURABH CHUGH","manager":"India","director":"India","commission":106773.06},
{"deal":"O - 228/25","month":"Nov-25","agent":"ARASH HADDAD MOMENI","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":66000},
{"deal":"O - 229/25","month":"Nov-25","agent":"MUKESH RAWAT","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":6250},
{"deal":"O - 230/25","month":"Nov-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":18750},
{"deal":"O - 231/25","month":"Nov-25","agent":"LAURA KAUPA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":442000},
{"deal":"O - 232/25","month":"Nov-25","agent":"LAVEENA FULWANI","manager":"AKANSHA","director":"MOHAMED ELSAYED","commission":10500},
{"deal":"O - 235/25","month":"Nov-25","agent":"IDRISS FADDOULI","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":52500},
{"deal":"O - 236/25","month":"Nov-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":146350},
{"deal":"O - 237/25","month":"Nov-25","agent":"HIBILDAS HARIDAS","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":141200},
{"deal":"O - 238/25","month":"Dec-25","agent":"JYOTI RAMESH DEVATWAL","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":98840},
{"deal":"O - 239/25","month":"Dec-25","agent":"NOURHAN AMER MELIGYMOHAMED","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":141250},
{"deal":"O - 240/25","month":"Dec-25","agent":"STEPHANIE SHUANG","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":704880},
{"deal":"O - 241/25","month":"Dec-25","agent":"ANKESH MISHRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":61820},
{"deal":"O - 242/25","month":"Dec-25","agent":"MUKESH RAWAT","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":46000},
{"deal":"O - 243/25","month":"Dec-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":689235.52},
{"deal":"O - 244/25","month":"Dec-25","agent":"OBAID NAZIR PEER","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":824315.52},
{"deal":"O - 245/25","month":"Dec-25","agent":"JYOTI RAMESH DEVATWAL","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":65100},
{"deal":"O - 246/25","month":"Dec-25","agent":"ARASH HADDAD MOMENI","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":28000},
{"deal":"O - 247/25","month":"Dec-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":18000},
{"deal":"O - 248/25","month":"Dec-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":16250},
{"deal":"O - 249/25","month":"Dec-25","agent":"LAVEENA FULWANI","manager":"AKANSHA","director":"MOHAMED ELSAYED","commission":20220},
{"deal":"O - 250/25","month":"Dec-25","agent":"MUHAMMAD MUJTABA","manager":"JIMMY","director":"MOHAMED ELSAYED","commission":74899.5},
{"deal":"O - 251/25","month":"Dec-25","agent":"ANKESH MISHRA","manager":"MOHAMED ELSAYED","director":"MOHAMED ELSAYED","commission":71000},
{"deal":"O - 253/25","month":"Dec-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":25000},
{"deal":"O-254/25","month":"Dec-25","agent":"WALID EL FRINI","manager":"WAQAS ABBASI","director":"MOHAMED ELSAYED","commission":8500}
];

const monthOrder = ['Jan-25','Feb-25','Mar-25','Apr-25','May-25','Jun-25','Jul-25','Aug-25','Sep-25','Oct-25','Nov-25','Dec-25'];
const COLORS = ['#2563eb','#059669','#7c3aed','#dc2626','#d97706','#0891b2','#be185d','#4f46e5','#65a30d','#ea580c'];

const formatAED = (v) => {
  if (v >= 1000000) return `${(v/1000000).toFixed(2)}M`;
  if (v >= 1000) return `${(v/1000).toFixed(0)}K`;
  return v.toFixed(0);
};

const formatFull = (v) => new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',maximumFractionDigits:0}).format(v);

export default function SalesDashboard() {
  const [data, setData] = useState(defaultData);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedDirector, setSelectedDirector] = useState('All');
  const [selectedManager, setSelectedManager] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState('All');
  const [uploadStatus, setUploadStatus] = useState('');

  // CSV Upload Handler
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadStatus('Processing...');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = results.data.map(row => ({
            deal: String(row['DEAL NO.'] || row['deal'] || '').trim(),
            month: String(row['MONTH'] || row['month'] || '').trim(),
            agent: String(row['AGENT(S)'] || row['agent'] || '').trim(),
            manager: String(row['Sales Manager'] || row['manager'] || '').replace(/\u00a0/g, ' ').trim(),
            director: String(row['Sales Director'] || row['director'] || '').trim(),
            commission: parseFloat(row['NET COMMISSION'] || row['commission'] || 0) || 0
          })).filter(r => r.deal && r.commission > 0);
          
          if (parsed.length > 0) {
            setData(parsed);
            setSelectedMonth('All');
            setSelectedDirector('All');
            setSelectedManager('All');
            setSelectedAgent('All');
            setUploadStatus(`✓ Loaded ${parsed.length} records`);
          } else {
            setUploadStatus('✗ No valid data found');
          }
        } catch (err) {
          setUploadStatus('✗ Error parsing file');
        }
      },
      error: () => setUploadStatus('✗ Failed to read file')
    });
  }, []);

  // Get unique months from data in correct order
  const months = useMemo(() => {
    const uniqueMonths = [...new Set(data.map(d => d.month))];
    return monthOrder.filter(m => uniqueMonths.includes(m));
  }, [data]);

  // Cascading filter options
  const directors = useMemo(() => {
    return ['All', ...new Set(data.map(d => d.director))].sort();
  }, [data]);

  const managers = useMemo(() => {
    let filtered = data;
    if (selectedDirector !== 'All') filtered = filtered.filter(d => d.director === selectedDirector);
    return ['All', ...new Set(filtered.map(d => d.manager))].sort();
  }, [data, selectedDirector]);

  const agents = useMemo(() => {
    let filtered = data;
    if (selectedDirector !== 'All') filtered = filtered.filter(d => d.director === selectedDirector);
    if (selectedManager !== 'All') filtered = filtered.filter(d => d.manager === selectedManager);
    return ['All', ...new Set(filtered.map(d => d.agent))].sort();
  }, [data, selectedDirector, selectedManager]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = data;
    if (selectedMonth !== 'All') result = result.filter(d => d.month === selectedMonth);
    if (selectedDirector !== 'All') result = result.filter(d => d.director === selectedDirector);
    if (selectedManager !== 'All') result = result.filter(d => d.manager === selectedManager);
    if (selectedAgent !== 'All') result = result.filter(d => d.agent === selectedAgent);
    return result;
  }, [data, selectedMonth, selectedDirector, selectedManager, selectedAgent]);

  // KPIs
  const kpis = useMemo(() => {
    const totalComm = filteredData.reduce((s,d) => s + d.commission, 0);
    const deals = filteredData.length;
    const avgDeal = deals ? totalComm / deals : 0;
    const uniqueAgents = new Set(filteredData.map(d => d.agent)).size;
    const commPerAgent = uniqueAgents ? totalComm / uniqueAgents : 0;
    return { totalComm, deals, avgDeal, uniqueAgents, commPerAgent };
  }, [filteredData]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    return months.map(m => {
      const mData = filteredData.filter(d => d.month === m);
      return {
        month: m.replace('-25',''),
        commission: mData.reduce((s,d) => s + d.commission, 0),
        deals: mData.length
      };
    });
  }, [filteredData, months]);

  // Director breakdown
  const directorData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.director]) grouped[d.director] = { name: d.director, commission: 0, deals: 0 };
      grouped[d.director].commission += d.commission;
      grouped[d.director].deals += 1;
    });
    const total = filteredData.reduce((s,d) => s + d.commission, 0);
    return Object.values(grouped)
      .sort((a,b) => b.commission - a.commission)
      .map((d,i) => ({ ...d, pct: total ? ((d.commission/total)*100).toFixed(1) : 0, fill: COLORS[i % COLORS.length] }));
  }, [filteredData]);

  // Manager breakdown
  const managerData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.manager]) grouped[d.manager] = { name: d.manager, commission: 0, deals: 0 };
      grouped[d.manager].commission += d.commission;
      grouped[d.manager].deals += 1;
    });
    return Object.values(grouped).sort((a,b) => b.commission - a.commission).slice(0, 10);
  }, [filteredData]);

  // Top agents
  const topAgents = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.agent]) grouped[d.agent] = { name: d.agent, commission: 0, deals: 0 };
      grouped[d.agent].commission += d.commission;
      grouped[d.agent].deals += 1;
    });
    return Object.values(grouped).sort((a,b) => b.commission - a.commission).slice(0, 10);
  }, [filteredData]);

  const handleDirectorChange = (v) => { setSelectedDirector(v); setSelectedManager('All'); setSelectedAgent('All'); };
  const handleManagerChange = (v) => { setSelectedManager(v); setSelectedAgent('All'); };
  const resetFilters = () => { setSelectedMonth('All'); setSelectedDirector('All'); setSelectedManager('All'); setSelectedAgent('All'); };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'system-ui,-apple-system,sans-serif',padding:'20px'}}>
      
      {/* Header */}
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <h1 style={{margin:0,fontSize:'22px',fontWeight:'700',color:'#1e293b'}}>Sales Commission Dashboard</h1>
            <p style={{margin:'4px 0 0',color:'#64748b',fontSize:'13px'}}>2025 YTD • {data.length} Total Records</p>
          </div>
          
          {/* CSV Upload */}
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <label style={{background:'#2563eb',color:'#fff',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>
              📁 Upload CSV
              <input type="file" accept=".csv" onChange={handleFileUpload} style={{display:'none'}} />
            </label>
            {uploadStatus && <span style={{fontSize:'12px',color:uploadStatus.includes('✓')?'#059669':'#dc2626'}}>{uploadStatus}</span>}
          </div>
        </div>
      </div>

      {/* Month Slicer - Prominent */}
      <div style={{background:'#fff',borderRadius:'12px',padding:'16px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{fontSize:'12px',fontWeight:'600',color:'#64748b',marginBottom:'10px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Select Month</div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          <button 
            onClick={() => setSelectedMonth('All')}
            style={{
              padding:'8px 16px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'500',
              background: selectedMonth === 'All' ? '#2563eb' : '#e2e8f0',
              color: selectedMonth === 'All' ? '#fff' : '#475569'
            }}>
            All
          </button>
          {months.map(m => (
            <button 
              key={m}
              onClick={() => setSelectedMonth(m)}
              style={{
                padding:'8px 16px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'500',
                background: selectedMonth === m ? '#2563eb' : '#e2e8f0',
                color: selectedMonth === m ? '#fff' : '#475569'
              }}>
              {m.replace('-25','')}
            </button>
          ))}
        </div>
      </div>

      {/* Hierarchy Filters */}
      <div style={{background:'#fff',borderRadius:'12px',padding:'16px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{display:'flex',gap:'16px',flexWrap:'wrap',alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#64748b',marginBottom:'6px'}}>SALES DIRECTOR</div>
            <select value={selectedDirector} onChange={e => handleDirectorChange(e.target.value)}
              style={{padding:'8px 12px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'13px',minWidth:'180px',background:'#fff'}}>
              {directors.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#64748b',marginBottom:'6px'}}>SALES MANAGER</div>
            <select value={selectedManager} onChange={e => handleManagerChange(e.target.value)}
              style={{padding:'8px 12px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'13px',minWidth:'180px',background:'#fff'}}>
              {managers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#64748b',marginBottom:'6px'}}>AGENT</div>
            <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}
              style={{padding:'8px 12px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'13px',minWidth:'180px',background:'#fff'}}>
              {agents.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <button onClick={resetFilters} style={{padding:'8px 16px',borderRadius:'6px',border:'none',background:'#fee2e2',color:'#dc2626',cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>
            Reset All
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'16px'}}>
        {[
          {label:'Total Commission',value:formatFull(kpis.totalComm),color:'#2563eb'},
          {label:'Total Deals',value:kpis.deals.toLocaleString(),color:'#059669'},
          {label:'Avg per Deal',value:formatAED(kpis.avgDeal),color:'#7c3aed'},
          {label:'Active Agents',value:kpis.uniqueAgents,color:'#dc2626'},
          {label:'Comm/Agent',value:formatAED(kpis.commPerAgent),color:'#d97706'}
        ].map((k,i) => (
          <div key={i} style={{background:'#fff',borderRadius:'10px',padding:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:'11px',color:'#64748b',fontWeight:'500',textTransform:'uppercase'}}>{k.label}</div>
            <div style={{fontSize:'22px',fontWeight:'700',color:k.color,marginTop:'6px'}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'16px',marginBottom:'16px'}}>
        {/* Monthly Trend */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 16px',fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>Monthly Commission Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
              <XAxis dataKey="month" tick={{fill:'#64748b',fontSize:11}}/>
              <YAxis tick={{fill:'#64748b',fontSize:11}} tickFormatter={v => formatAED(v)}/>
              <Tooltip formatter={(v) => formatFull(v)} contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}}/>
              <Line type="monotone" dataKey="commission" stroke="#2563eb" strokeWidth={2} dot={{fill:'#2563eb',r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Director Pie */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 16px',fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>By Sales Director</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={directorData} dataKey="commission" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} label={({pct}) => `${pct}%`} labelLine={false}>
                {directorData.map((e,i) => <Cell key={i} fill={e.fill}/>)}
              </Pie>
              <Tooltip formatter={(v) => formatFull(v)} contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'8px'}}>
            {directorData.map((d,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'10px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'2px',background:d.fill}}/>
                <span style={{color:'#64748b'}}>{d.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
        {/* Manager Bar */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 16px',fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>Commission by Sales Manager</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={managerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
              <XAxis type="number" tick={{fill:'#64748b',fontSize:10}} tickFormatter={v => formatAED(v)}/>
              <YAxis type="category" dataKey="name" width={130} tick={{fill:'#475569',fontSize:10}}/>
              <Tooltip formatter={(v) => formatFull(v)} contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}}/>
              <Bar dataKey="commission" fill="#059669" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Agents Bar */}
        <div style={{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 16px',fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>Top 10 Agents</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topAgents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
              <XAxis type="number" tick={{fill:'#64748b',fontSize:10}} tickFormatter={v => formatAED(v)}/>
              <YAxis type="category" dataKey="name" width={130} tick={{fill:'#475569',fontSize:10}}/>
              <Tooltip formatter={(v) => formatFull(v)} contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}}/>
              <Bar dataKey="commission" fill="#7c3aed" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Table */}
      <div style={{background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <h3 style={{margin:'0 0 16px',fontSize:'14px',fontWeight:'600',color:'#1e293b'}}>Top Agents Summary</h3>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
            <thead>
              <tr style={{background:'#f8fafc'}}>
                <th style={{textAlign:'left',padding:'10px 8px',color:'#64748b',fontWeight:'600',borderBottom:'1px solid #e2e8f0'}}>#</th>
                <th style={{textAlign:'left',padding:'10px 8px',color:'#64748b',fontWeight:'600',borderBottom:'1px solid #e2e8f0'}}>Agent</th>
                <th style={{textAlign:'right',padding:'10px 8px',color:'#64748b',fontWeight:'600',borderBottom:'1px solid #e2e8f0'}}>Commission</th>
                <th style={{textAlign:'right',padding:'10px 8px',color:'#64748b',fontWeight:'600',borderBottom:'1px solid #e2e8f0'}}>Deals</th>
                <th style={{textAlign:'right',padding:'10px 8px',color:'#64748b',fontWeight:'600',borderBottom:'1px solid #e2e8f0'}}>Avg/Deal</th>
                <th style={{textAlign:'right',padding:'10px 8px',color:'#64748b',fontWeight:'600',borderBottom:'1px solid #e2e8f0'}}>Share %</th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map((a,i) => (
                <tr key={i} style={{borderBottom:'1px solid #f1f5f9'}}>
                  <td style={{padding:'10px 8px',color:'#1e293b',fontWeight:'600'}}>{i+1}</td>
                  <td style={{padding:'10px 8px',color:'#1e293b'}}>{a.name}</td>
                  <td style={{padding:'10px 8px',textAlign:'right',color:'#2563eb',fontWeight:'600'}}>{formatFull(a.commission)}</td>
                  <td style={{padding:'10px 8px',textAlign:'right',color:'#475569'}}>{a.deals}</td>
                  <td style={{padding:'10px 8px',textAlign:'right',color:'#475569'}}>{formatAED(a.commission/a.deals)}</td>
                  <td style={{padding:'10px 8px',textAlign:'right'}}>
                    <span style={{background:'#dbeafe',color:'#2563eb',padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:'500'}}>
                      {((a.commission/kpis.totalComm)*100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{textAlign:'center',marginTop:'16px',color:'#94a3b8',fontSize:'11px'}}>
        Dashboard auto-updates on CSV upload • Filters cascade: Director → Manager → Agent
      </div>
    </div>
  );
}
