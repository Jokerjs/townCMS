import Layout from '@/views/layout/Layout'

export default {
    renderTreeData: (result) => {
        let treeData = result
        let childArr = treeData.filter((doc) => {
            return doc.parentId != '0'
        })
        for (let i = 0; i < childArr.length; i++) {
            let child = childArr[i]
            for (let j = 0; j < treeData.length; j++) {
                let treeItem = treeData[j]
                if (treeItem.id == child.parentId) {
                    if (!treeItem.children) treeItem.children = []
                    treeItem.children.push(child)
                    break
                }
            }
        }
        treeData = treeData.filter((doc) => {
            return doc.parentId == '0'
        });
        return treeData
    },
    AsyncRouter: (list) => {
        let currentArr = []
        let parentTemp = {}
        let temp = {}
        for (let i in list) {
            temp[list[i].id] = list[i]
        }
        for (let i in temp) {
            if (temp[i].parentId === '0' && temp[i].api === ''){
                let currentParent = renderTemp(temp[i], true)
                parentTemp[temp[i].id] = currentParent
            }
        }
        for (let r in temp) {
            for (let p in parentTemp) {
                if(temp[r].parentId===p){
                    let currentChildren = renderTemp(temp[r])
                    parentTemp[p].children.push(currentChildren)
                }
            }
        }
        for (var item in parentTemp) {
            currentArr.push(parentTemp[item])
        }

        return currentArr
    }
}

function renderTemp(temp, parent = false) {
    const newTemp = {}
    if (parent) {
        newTemp.path = '/'+temp.routePath
        newTemp.component = Layout
        newTemp.redirect = '/'+temp.componentPath
        newTemp.children = new Array()
    } else {
        newTemp.path = temp.routePath
        newTemp.component = () => import('@/views/' + temp.componentPath)
    }
    newTemp.name = temp.routePath
    newTemp.meta = {
        title: temp.label
    }
    if (temp.icon) {
        newTemp.meta.icon = temp.icon
    }
    return newTemp
}