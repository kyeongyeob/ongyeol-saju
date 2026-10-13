// Frozen, inspectable service rules. These weights are a heuristic, not a consensus scale.
window.OngyeolInterpretationRules={
 version:'온결 자평·억부 참고 v1',
 elements:['木','火','土','金','水'],
 pillarWeights:{연주:1,월주:2.4,일주:1.4,시주:1.2},
 hiddenRatios:{1:[1],2:[0.7,0.3],3:[0.6,0.3,0.1]},
 strengthWeights:{season:0.4,roots:0.3,support:0.3},
 thresholds:{weak:45,strong:55},
 seasonElement:{寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水',子:'水',丑:'土'},
 lu:{甲:'寅',乙:'卯',丙:'巳',丁:'午',戊:'巳',己:'午',庚:'申',辛:'酉',壬:'亥',癸:'子'},
 yangBlade:{甲:'卯',丙:'午',戊:'午',庚:'酉',壬:'子'},
 noble:{甲:'丑未',乙:'子申',丙:'亥酉',丁:'亥酉',戊:'丑未',己:'子申',庚:'丑未',辛:'寅午',壬:'卯巳',癸:'卯巳'},
 ghostPairs:['子酉','丑午','寅未','卯申','辰亥','巳戌'],
 whiteTigerPillars:['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑'],
 limits:'월령·통근·비겁·인성을 수치화한 서비스 참고 모델입니다. 합화·종격·특수격·격의 성패·조후·월령 사령 일수는 판정하지 않습니다. 부족한 오행과 보완 후보는 같은 개념이 아닙니다.'
};
