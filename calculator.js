const substitutionList = [['w', 'z', 'q', 'v', 'y', 'n', 'i', 'f'], ['u', 's', 'k', 'ff', 'ee', 'in', 'y', 'ph']]

function leaderFilter(initial, word) {
    if (substitutionList[0].includes(initial)) {
        const substitute = substitutionList[1][substitutionList[0].indexOf(initial)]
        if (substitute.length > 1) {
            return (word[0].toLowerCase() === initial || word.substring(0, 2).toLowerCase() === substitute)
        } else {
            return (word[0].toLowerCase() === initial || word[0].toLowerCase() === substitute)
        }
    } else {
        return word[0].toLowerCase() === initial
    }
}

function teamFilter(initial, word) {
    if (substitutionList[0].includes(initial)) {
        const substitute = substitutionList[1][substitutionList[0].indexOf(initial)]
        return (word.toLowerCase().includes(initial) || word.toLowerCase().includes(substitute))
    }
    else {
        return word.toLowerCase().includes(initial)
    }
}

function retrieveLeader(initial, word) {
    if(substitutionList[0].includes(initial) && word.toLowerCase()[0] !== (initial)){
        const substitute = substitutionList[1][substitutionList[0].indexOf(initial)]
        if (substitute.length > 1){
            return word.toLowerCase().substring(0, 2) === substitute
        } else {
            return word.toLowerCase()[0] === substitute
        }
    } else{
        return word.toLowerCase()[0] === initial
    }
}

function retrieveIndex(initial, word) {
    if(substitutionList[0].includes(initial) && !word.toLowerCase().includes(initial)){
        const substitute = substitutionList[1][substitutionList[0].indexOf(initial)]
        if (substitute.length > 1) {
            return word.toLowerCase().indexOf(substitute[0])
        } else {
            return word.toLowerCase().indexOf(substitute)
        }
    } else {
        return word.toLowerCase().indexOf(initial)
    }
}

async function calculateNames() {
    const form = document.querySelector('#teamdata')
    const teamSpace = document.getElementById('teamspace')
    while (teamSpace.firstChild) {
        teamSpace.removeChild(teamSpace.firstChild)
    }
    const data = Object.fromEntries(new FormData(form))
    const forceLeader = data.forceleader !== undefined
    const singleWord = data.singleword !== undefined
    const member1 = [data.f1, data.l1]
    const i1 = [member1[0][0], member1[1][0]]
    const member2 = [data.f2, data.l2]
    const i2 = [member2[0][0], member2[1][0]]
    const member3 = [data.f3, data.l3]
    const i3 = [member3[0][0], member3[1][0]]
    const member4 = [data.f4, data.l4]
    const i4 = [member4[0][0], member4[1][0]]
    const res = await fetch('https://raw.githubusercontent.com/meodai/color-names/master/dist/colornames.json')
    if (res.ok) {
        let colourList = await res.json()
        if(singleWord){
            colourList = colourList.filter((colour) => !colour.name.includes(' '))
        }
        let teamList
        if (forceLeader) {
            const leaderList = colourList.filter((colour) => (leaderFilter(i1[0].toLowerCase(), colour.name)) || (leaderFilter(i1[1].toLowerCase(), colour.name)))
            teamList = leaderList.filter((colour) =>
                ((teamFilter(i2[0].toLowerCase(), colour.name)) || (teamFilter(i2[1].toLowerCase(), colour.name))) &&
                ((teamFilter(i3[0].toLowerCase(), colour.name)) || (teamFilter(i3[1].toLowerCase(), colour.name))) &&
                ((teamFilter(i4[0].toLowerCase(), colour.name)) || (teamFilter(i4[1].toLowerCase(), colour.name)))
            )
        } else {
            const leaderList = colourList.filter((colour) =>
                ((leaderFilter(i1[0].toLowerCase(), colour.name)) || (leaderFilter(i1[1].toLowerCase(), colour.name))) ||
                ((leaderFilter(i2[0].toLowerCase(), colour.name)) || (leaderFilter(i2[1].toLowerCase(), colour.name))) ||
                ((leaderFilter(i3[0].toLowerCase(), colour.name)) || (leaderFilter(i3[1].toLowerCase(), colour.name))) ||
                ((leaderFilter(i4[0].toLowerCase(), colour.name)) || (leaderFilter(i4[1].toLowerCase(), colour.name)))
            )
            teamList = leaderList.filter((colour) =>
                ((teamFilter(i1[0].toLowerCase(), colour.name)) || (teamFilter(i1[1].toLowerCase(), colour.name))) &&
                ((teamFilter(i2[0].toLowerCase(), colour.name)) || (teamFilter(i2[1].toLowerCase(), colour.name))) &&
                ((teamFilter(i3[0].toLowerCase(), colour.name)) || (teamFilter(i3[1].toLowerCase(), colour.name))) &&
                ((teamFilter(i4[0].toLowerCase(), colour.name)) || (teamFilter(i4[1].toLowerCase(), colour.name)))
            )
        }
        teamList.forEach((team) => {
            let mem1Pos
            if(forceLeader){
                if(retrieveLeader(i1[0].toLowerCase(), team.name)){
                    mem1Pos = {index: 0, initial: i1[0].toUpperCase()}
                } else if(retrieveLeader(i1[1].toLowerCase(), team.name)){
                    mem1Pos = {index: 0, initial: i1[1].toUpperCase()}
                }
            } else {
                mem1Pos = [{index: retrieveIndex(i1[0].toLowerCase(), team.name), initial: i1[0].toUpperCase()}, {index: retrieveIndex(i1[1].toLowerCase(), team.name), initial: i1[1].toUpperCase()}]
                mem1Pos = mem1Pos.filter((x) => x.index !== -1)
                mem1Pos = mem1Pos.reduce((comparator, currentValue) => comparator.index < currentValue ? comparator : currentValue)
            }
            let mem2Pos = [{index: retrieveIndex(i2[0].toLowerCase(), team.name), initial: i2[0].toUpperCase()}, {index: retrieveIndex(i2[1].toLowerCase(), team.name), initial: i2[1].toUpperCase()}]
            mem2Pos = mem2Pos.filter((x) => x.index !== -1)
            mem2Pos = mem2Pos.reduce((comparator, currentValue) => comparator.index < currentValue ? comparator : currentValue)
            let mem3Pos = [{index: retrieveIndex(i3[0].toLowerCase(), team.name), initial: i3[0].toUpperCase()}, {index: retrieveIndex(i3[1].toLowerCase(), team.name), initial: i3[1].toUpperCase()}]
            mem3Pos = mem3Pos.filter((x) => x.index !== -1)
            mem3Pos = mem3Pos.reduce((comparator, currentValue) => comparator.index < currentValue ? comparator : currentValue)
            let mem4Pos = [{index: retrieveIndex(i4[0].toLowerCase(), team.name), initial: i4[0].toUpperCase()}, {index: retrieveIndex(i4[1].toLowerCase(), team.name), initial: i4[1].toUpperCase()}]
            mem4Pos = mem4Pos.filter((x) => x.index !== -1)
            mem4Pos = mem4Pos.reduce((comparator, currentValue) => comparator.index < currentValue ? comparator : currentValue)
            teamOrder = [mem1Pos, mem2Pos, mem3Pos, mem4Pos]
            teamOrder.sort((a, b) => a.index - b.index)
            teamName = teamOrder.map((a) => a.initial).join('')
            tableRow = document.createElement('tr')
            nameCell = document.createElement('td')
            nameCell.append(team.name)
            colourCell = document.createElement('td')
            colourCell.style.backgroundColor = team.hex
            colourCell.style.width = '50px'
            teamCell = document.createElement('td')
            teamCell.append(teamName)
            tableRow.appendChild(nameCell)
            tableRow.appendChild(colourCell)
            tableRow.appendChild(teamCell)
            teamSpace.appendChild(tableRow)
        })
    } else {
        console.error("Couldn't access colour names.")
        teamSpace.append("The colour name list is unavailable.")
    }
}