// const schools = [{text:'Community College of the Air Force',value : 'Community College of the Air Force'}, 
// {text:'Community College of the Air Force',value : 'Community College of the Air Force'}, 
// {text:'Alabama A & M University',value : 'Alabama A & M University'}, 
// {text:'University of Alabama at Birmingham',value : 'University of Alabama at Birmingham'}, 
// {text:'UAB School of Optometry',value : 'UAB School of Optometry'}]



const schools = [
'Community College of the Air Force',
'Alabama A & M University',
'University of Alabama at Birmingham',
'UAB School of Optometry'
]
const schoolKey=[]

for (let i = 0; i < schools.length; i++) {
	schoolKey.push({text: schools[i], value :schools[i]})
}


console.log(schoolKey)


export default schoolKey