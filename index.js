/**
 * run a series of tasks with next controller
 * @author imcuttle
 */
export default function runSeq(tasks, argvs = [], thisArg) {
  const tasksCloned = tasks.slice()

  function next(fn, tasksCloned, ...passedArgvs) {
    if (typeof fn === 'function') {
      const innerNext = next.bind(null, tasksCloned[0], tasksCloned.slice(1))
      innerNext.all = function(...passedArgvs) {
        return runSeq.apply(this, [tasks, passedArgvs, thisArg])
      }
      return fn.apply(thisArg, passedArgvs.concat(innerNext))
    }
  }

  return next.apply(thisArg, [tasksCloned[0], tasksCloned.slice(1)].concat(argvs))
}

export function waterFall(list, ...argv) {
  return runSeq(
    list.map(fn => {
      return function(...argv) {
        const argvs = argv.slice(0, -1)
        const next = argv[argvs.length]

        return fn.apply(this, argvs.concat(Object.assign(() => next(...argvs), next)))
      }
    }),
    ...argv
  )
}
