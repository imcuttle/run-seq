/**
 * run a series of tasks with next controller
 * @author imcuttle
 */

type SeqFunc = (tasks: Function[], args?: any[], thisArg?: any) => any
declare let $: SeqFunc

export default $
export const waterFall: SeqFunc
