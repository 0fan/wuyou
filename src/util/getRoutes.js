function getRelation (str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!')
  }

  const arr1 = str1.split('/')
  const arr2 = str2.split('/')

  if (arr2.every((v, i) => v === arr1[i])) {
    return 1
  } else if (arr1.every((v, i) => v === arr2[i])) {
    return 2
  }

  return 3
}

function getRenderArr (routes) {
  let renderArr = []

  renderArr.push(routes[0])

  routes.forEach((v, i) => {
    let isAdd = false

    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, v) === 3)

    // 去重
    renderArr.filter(item => getRelation(item, v) !== 1)

    if (isAdd) {
      renderArr.push(routes[i])
    }
  })

  return renderArr
}

// 获取当前路由下面的子菜单
export function getRoutes (path, routerData) {
  let routes = Object.keys(routerData).filter(
    v => v.indexOf(path) === 0 && v !== path
  )

  routes = routes.map(v => v.replace(path, ''))

  const renderArr = getRenderArr(routes)

  const renderRoutes = renderArr.map(v => {
    const exact = !routes.some(route => route !== v && getRelation(route, v) === 1)

    return {
      exact,
      ...routerData[`${ path }${ v }`],
      key: `${ path }${ v }`,
      path: `${ path }${ v }`
    }
  })

  return renderRoutes
}
