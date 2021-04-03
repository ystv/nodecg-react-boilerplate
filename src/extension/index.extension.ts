import type {NodeCG} from '../../../../types/server'

export = (nodecg: NodeCG) => {
    nodecg.sendMessage("hello");
}
