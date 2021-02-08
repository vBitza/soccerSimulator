Soccer Simulator


 Structura fisierelor proiectului

  root
  
  │   players.json              	       # Contine statisticile jucatorilor din FIFA (2018)
  
  |   players.controller	       # Parseaza jucatorii din fisierul cu jucatori si creeaza echipe
  
  |   teams.controller	       # Contine functionalitati legate de echipe
  
  |   match.controller             # Se ocupa de simularea unui meci
  
  └───frontend            	       # Fisiere necesare pentru interfata grafica
  
  └───teams          	       # Fisiere cu jucatorii echipelor
  
 
Tehnologii folosite

Aplicatia de simulare a fost realizat folosind NodeJS (JavaScript runtime environment). Interfata Grafica a fost realizata folosind framework-ul Angular (JavaScript). Pentru a putea avea comunicare intre interfata grafica si aplicatia care simuleaza meciul, am integrat aplicatia intr-un server Express si am folosit WebSockets. 

Resurse auxiliare

Pentru a putea genera statistici cat mai reale si pentru a putea compara rezultatele simularilor cu rezultatele unor meciuri reale am hotarat sa folosim statisticile jucatorilor de fotbal din jocul FIFA 2018. Am gasit pe internet un fisier JSON ce contine toti jucatorii echipelor (players.json). Pentru a putea genera echipele am create mai multe functii auxiliare care extrag jucatorii unei echipe din fisierul JSON si ii grupeaza in cadrul unei echipe apoi este scris fisierul echipei in folderul teams.
Fiecare jucator are urmatoarele caracteristici: 

["ID", "Name", "Age", "Photo", "Nationality", "Flag", "Overall", "Potential", "Club", "Club Logo", "Value", "Wage", "Special", "Acceleration", "Aggression", "Agility", "Balance", "BallControl", "Body Type", "CAM", "CB", "CDM", "CF", "CM", "Composure", "Contract Valid Until", "Crossing", "Curve", "Dribbling", "FKAccuracy", "Finishing", "GKDiving", "GKHandling", "GKKicking", "GKPositioning", "GKReflexes", "HeadingAccuracy", "Interceptions", "International Reputation", "Jersey Number", "Joined", "Jumping", "LAM", "LB", "LCB", "LCM", "LDM", "LF", "LM", "LS", "LW", "LWB", "Loaned From", "LongPassing", "LongShots", "Marking", "Penalties", "Position", "Positioning", "Preferred Foot", "RAM", "RB", "RCB", "RCM", "RDM", "RF", "RM", "RS", "RW", "RWB", "Reactions", "Real Face", "Release Clause", "ST", "ShortPassing", "ShotPower", "Skill Moves", "SlidingTackle", "SprintSpeed", "Stamina", "StandingTackle", "Strength", "Vision", "Volleys", "Weak Foot", "Work Rate"] 

In schimb, pentru simularea noastra am folosit doar urmatoarele caracteristici ale unui jucator si am creat cateva atribute suplimentare: 
caracteristici folosite: 

 [ “Overall”, “Potential”, “Aggression”, “Stamina”,  “ShortPassing”, “LongPassing”, “ShotPower”, “LongShots”, “Finishing”, “GKPositioning”, “GKDiving”, “GKReflexes” ]

Atribute suplimentare:

[ “redCards”, “yellowCards”, “passing”{(ShortPassing+LongPassing / 2)} ]

Caracteristicile unei echipe

team = {  
    teamName,  
    startingPlayers: [],  
    playersOnField: [],  
    attackPlayers: [],  
    middlePlayers: [],  
    backPlayers: [],  
    eliminatedPlayers: [],  
    gk: null,  
    stats: {  
        attackScore: 0, (Media atacantilor) 
        middleScore: 0,  (Media mijlocasilor)
        backScore: 0,  (Media fundasilor)
        averageScore: 0,  (Media tuturor jucatorilor)
        aggresion: 0,  (Media agresiunii tuturor jucatorilor)
        passing: 0,  (Media paselor cu succes a tuturor jucatorilor)
    },  
    yellowCards: 0,  
    redCards: 0,  
    attempts: 0,  
    goals: 0,  
    shotsOnTarget: 0,  
    shots: 0,  
    fouls: 0,   
    longShots: 0,  
    closeShots: 0  
}  




Explicarea algoritmului

Simularea meciului este realizata iterativ, in fiecare iteratie se pot intampla o serie de actiuni. Rezultatul actiunilor este calculat pe baza mai multor statistici. Am ales in mod conventional ca un meci sa aiba 360 de iteratii ( o iteratie = 15 de secunde dintr-un meci ). Intr-o iteratie se pot intampla urmatoarele 3 evenimente (fault,  sut sau pasa/deposedare). 
Actiunile sunt stabilite pe baza proprietatii ballPositionInField din cadrul obiectului matchSettings. Acest parametru poate lua valori din intervalul [-2, 5] unde valorile negative reprezinta terenul echipei in posesia mingii, 0 reprezinta mijlocul terenului si valorile intre 1 si 5 reprezinta terenul echipei adverse. 
Pentru a stabili daca un jucator faulteaza am folosit media faulturilor pe meci (intre 20 si 27) si am ajustat folosind urmatoarele statistici ale echipelor: Aggresion, relativeStrength, Agility.
homeTeam.potentialFouls = Math.roundallPotentialFouls * homeTeam.stats.aggresion - homeRelativeStrength - awayTeam.stats.agility  100  100 ;  
O echipa mai puternica decat adversarul sau va recurge mai putin la faulturi. In acelasi timp o echipa adversa cu agilitate mai mare va fi mai greu de faultat. 
In cazul in care s-a produs un fault atunci algoritmul va trebui sa decida daca un jucator primeste cartonas galben sau rosu, acest lucru este determinat pe baza mediei cartonaselor aratate intr-un joc. In functie de pozitia mingii in teren (ballPositionInField) este ales si jucatorul atentionat folosind urmatorul algoritm:
positionInField < 2 => va atentiona un atacant
positionInField < 4 => va atentiona un mijlocas
altfel => va atentiona un fundas


Urmatoarea actiune calculate este cea de sut la poarta. Aceasta actiune este posibila doar atunci cand pozitia mingii in teren este 4 sau 5. In functie de pozitie, formula de calcul a actiunii are diferiti coeficienti. 


if (ballPositionInField == 4) {  
  attackingTeam.longShots++;  
   
   if (chance.bool({likelihood: (shooter.LongShots + shooter.FKAccuracy) / 2})) {  
      
      attackingTeam.shotsOnTarget++;  
      
      if (chance.bool({likelihood: (0.4 * shooter.ShotPower + 0.6 * shooter.LongShots) / (0.4 * gk.GKPositioning + 0.6 * gk.GKDiving) * 10})) {  
         
         return {  
           
           attackingTeam,  
             
             isGoal: true,  
           
           playerWhoScored: shooter  
        
        };  
     
     };  
  
  }  
}  


In cazul suturilor de la distanta prima data se calculeaza daca jucatorul reuseste sa nimereasca poarta folosind atributele  LongShots si FKAccuracy (FreeKick Accuracy). Daca acesta nimereste poarta atunci se calculeaza daca a reusit sa si marcheze. Acest lucru se face folosind statisticile jucatorului care a sutat si statisticile portarului advers. In cazul suturilor de la distanta conteaza puterea pozitionarea portarului (GKPositioning) si cat de bine se pricepe la a sari dupa mingi (GKDiving).

if (ballPositionInField == 5) {  
      
      attackingTeam.closeShots++;  
      
      if (chance.bool({likelihood: shooter.Finishing})) {  
      
        attackingTeam.shotsOnTarget++;  
      
        if (chance.bool({likelihood: (0.6*shooter.ShotPower + 0.6*shooter.Finishing)/ (0.4 * gk.GKPositioning + 0.6 * gk.GKReflexes) * 10})) {  
      
           return {  
      
             attackingTeam,  
      
             isGoal: true,  
      
              playerWhoScored: shooter  
      
          };            
      
      }  
      
      }  
    
    } 



In cazul suturilor de  la apropiere (din interiorul careului) se decide daca jucatorul a nimerit poarta folosind atributul Finishing. Daca acesta nimereste poarta, se calculeaza daca a marcat sau nu. In cazul suturilor de la apropiere calculul se face folosind alte attribute fata de suturile de la distanta, aici conteaza mai mult puterea cu care suteaza jucatorul. In acelasi timp si pentru portar, pozitionarea nu este la fel de important ci este mai important sa aiba reflexe (GKReflexes). 

Ultima actiune calculate este cea de avansare/deposedare. Aceasta se intampla doar daca echipa in posesie nu a marcat deja un gol. In functie de pozitia mingii in teren, se calculeaza daca echipa avanseaza pe baza jucatorilor din sectiunea respective a terenului. 
