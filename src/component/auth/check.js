import React from 'react'

/**
 * 通用权限检查方法
 * @auth 当前权限
 * @authList 权限列表
 * @target 通过的组件
 * @Exception 未通过的组件
 */
export default (
  auth,
  authList,

  target,
  Exception
) => {
  if (typeof auth === 'boolean') {
    if (auth && authList) {
      return target
    }

    return Exception
  }

  // 没有权限就是所有权限
  if (!authList) {
    return target
  }

  // 数组处理
  if (Array.isArray(auth)) {
    if (auth.indexOf(authList) >= 0) {
      return target
    }

    return Exception
  }

  // string 处理
  if (typeof auth === 'string') {
    if (auth === authList) {
      return target
    }
    return Exception
  }

  // Function 处理
  if (typeof auth === 'function') {
    try {
      const bool = auth(authList)

      if (bool) {
        return target
      }

      return Exception
    } catch (error) {
      throw error
    }
  }

  return target
}
