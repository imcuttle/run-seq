/**
 * run a series of tasks with next controller
 * @author imcuttle
 */
export default function runSeq(tasks, argvs = [], thisArg) {
  const tasksCloned = tasks.slice()

  function next(fn, ...passedArgvs) {
    if (fn) {
      const innerNext = next.bind(null, tasksCloned.shift())
      innerNext.all = function(...passedArgvs) {
        return runSeq.apply(this, [tasks, passedArgvs, thisArg])
      }
      return fn.apply(thisArg, passedArgvs.concat(innerNext))
    }
  }

  return next.apply(thisArg, [tasksCloned.shift()].concat(argvs))
}

export function noPassing(list, ...argv) {
  return runSeq(
    list.map(fn => {
      return function(...argv) {
        const argvs = argv.slice(0, -1)
        const next = argv[argvs.length]

        return fn.apply(
          this,
          argvs.concat(() => next(...argvs))
        )
      }
    }),
    ...argv
  )
}
