/**
 * run a series of tasks with next controller
 * @author imcuttle
 */

type SeqFunc = (tasks: Function[], args?: [], thisArg?: any) => any
declare let $: SeqFunc

export default $
export const noPassing: SeqFunc
