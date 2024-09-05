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
    const initial1 = [data.f1[0], data.l1[0]]
    const initial2 = [data.f2[0], data.l2[0]]
    const initial3 = [data.f3[0], data.l3[0]]
    const initial4 = [data.f4[0], data.l4[0]]
    const res = await fetch('https://raw.githubusercontent.com/meodai/color-names/master/dist/colornames.json')
    if (res.ok) {
        let colourList = await res.json()
        if(singleWord){
            colourList = colourList.filter((colour) => !colour.name.includes(' '))
        }
        let teamList
        if (forceLeader) {
            const leaderList = colourList.filter((colour) => (leaderFilter(initial1[0].toLowerCase(), colour.name)) || (leaderFilter(initial1[1].toLowerCase(), colour.name)))
            teamList = leaderList.filter((colour) =>
                ((teamFilter(initial2[0].toLowerCase(), colour.name)) || (teamFilter(initial2[1].toLowerCase(), colour.name))) &&
                ((teamFilter(initial3[0].toLowerCase(), colour.name)) || (teamFilter(initial3[1].toLowerCase(), colour.name))) &&
                ((teamFilter(initial4[0].toLowerCase(), colour.name)) || (teamFilter(initial4[1].toLowerCase(), colour.name)))
            )
        } else {
            const leaderList = colourList.filter((colour) =>
                ((leaderFilter(initial1[0].toLowerCase(), colour.name)) || (leaderFilter(initial1[1].toLowerCase(), colour.name))) ||
                ((leaderFilter(initial2[0].toLowerCase(), colour.name)) || (leaderFilter(initial2[1].toLowerCase(), colour.name))) ||
                ((leaderFilter(initial3[0].toLowerCase(), colour.name)) || (leaderFilter(initial3[1].toLowerCase(), colour.name))) ||
                ((leaderFilter(initial4[0].toLowerCase(), colour.name)) || (leaderFilter(initial4[1].toLowerCase(), colour.name)))
            )
            teamList = leaderList.filter((colour) =>
                ((teamFilter(initial1[0].toLowerCase(), colour.name)) || (teamFilter(initial1[1].toLowerCase(), colour.name))) &&
                ((teamFilter(initial2[0].toLowerCase(), colour.name)) || (teamFilter(initial2[1].toLowerCase(), colour.name))) &&
                ((teamFilter(initial3[0].toLowerCase(), colour.name)) || (teamFilter(initial3[1].toLowerCase(), colour.name))) &&
                ((teamFilter(initial4[0].toLowerCase(), colour.name)) || (teamFilter(initial4[1].toLowerCase(), colour.name)))
            )
        }
        teamList.forEach((team) => {
            let mem1Pos
            if(forceLeader){
                if(retrieveLeader(initial1[0].toLowerCase(), team.name)){
                    mem1Pos = {index: 0, initial: initial1[0].toUpperCase()}
                } else if(retrieveLeader(initial1[1].toLowerCase(), team.name)){
                    mem1Pos = {index: 0, initial: initial1[1].toUpperCase()}
                }
            } else {
                mem1Pos = [{index: retrieveIndex(initial1[0].toLowerCase(), team.name), initial: initial1[0].toUpperCase()}, {index: retrieveIndex(initial1[1].toLowerCase(), team.name), initial: initial1[1].toUpperCase()}]
                mem1Pos = mem1Pos.filter((x) => x.index !== -1)
                mem1Pos = mem1Pos.reduce((comparator, currentValue) => comparator.index < currentValue.index ? comparator : currentValue)
            }
            let mem2Pos = [{index: retrieveIndex(initial2[0].toLowerCase(), team.name), initial: initial2[0].toUpperCase()}, {index: retrieveIndex(initial2[1].toLowerCase(), team.name), initial: initial2[1].toUpperCase()}]
            mem2Pos = mem2Pos.filter((x) => x.index !== -1)
            mem2Pos = mem2Pos.reduce((comparator, currentValue) => comparator.index < currentValue.index ? comparator : currentValue)
            let mem3Pos = [{index: retrieveIndex(initial3[0].toLowerCase(), team.name), initial: initial3[0].toUpperCase()}, {index: retrieveIndex(initial3[1].toLowerCase(), team.name), initial: initial3[1].toUpperCase()}]
            mem3Pos = mem3Pos.filter((x) => x.index !== -1)
            mem3Pos = mem3Pos.reduce((comparator, currentValue) => comparator.index < currentValue.index ? comparator : currentValue)
            let mem4Pos = [{index: retrieveIndex(initial4[0].toLowerCase(), team.name), initial: initial4[0].toUpperCase()}, {index: retrieveIndex(initial4[1].toLowerCase(), team.name), initial: initial4[1].toUpperCase()}]
            mem4Pos = mem4Pos.filter((x) => x.index !== -1)
            mem4Pos = mem4Pos.reduce((comparator, currentValue) => comparator.index < currentValue.index ? comparator : currentValue)
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