import { Store } from '@subsquid/typeorm-store'
import { getAddress } from 'ethers/lib/utils'
import Axios from 'axios'
import { BatchContext } from '@subsquid/substrate-processor'
import {metadatas} from '../utils/entitiesManager'
import {Attribute, Metadata, Token} from '../model'
import { IRawMetadata } from '../types/custom/metadata'

export const BASE_URL = 'https://moonsama.mypinata.cloud/'

const api = Axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
})

export const sanitizeIpfsUrl = (ipfsUrl: string): string => {
    
    const reg1 = /^ipfs:\/\/ipfs/
    if (reg1.test(ipfsUrl)) {
        return ipfsUrl.replace('ipfs://', BASE_URL)
    }
    
    const reg2 = /^ipfs:\/\//
    if (reg2.test(ipfsUrl)) {
        return ipfsUrl.replace('ipfs://', `${BASE_URL}ipfs/`)
    }
    
    return ipfsUrl
}

export const fetchMetadata = async (
    ctx: BatchContext<Store, unknown>,
    url: string,
    ): Promise<IRawMetadata | null> => {
        try {
            const properUrl = sanitizeIpfsUrl(url)
            const { status, data } = await api.get(sanitizeIpfsUrl(properUrl))
            ctx.log.info(`[IPFS] ${status} ${properUrl}`)
            if (status < 400) {
                return data as IRawMetadata
            }
        } catch (e) {
            ctx.log.warn(`[IPFS] ERROR ${(e as Error).message}`)
        }
        return null
    }
    


export async function parseMetadata(ctx: BatchContext<Store, unknown> , url: string) : Promise<Metadata | undefined> {
    const rawMeta = await fetchMetadata(ctx, url)
    if (!rawMeta) return undefined
    const attributes: Attribute[] = rawMeta.attributes.map((attr)=> new Attribute({
        displayType: attr.display_type ? String(attr.display_type) : attr.display_type,
        traitType: String(attr.trait_type),
        value: String(attr.value)
    }))
    const metadata = new Metadata({
        id: url,
        name: rawMeta.name,
        description: rawMeta.description,
        image: rawMeta.image,
        externalUrl: rawMeta.external_url,
        attributes,
        layers: rawMeta.layers,
        artist: rawMeta.artist,
        artistUrl: rawMeta.artist_url,
        composite: Boolean(rawMeta.composite),
        type: rawMeta.type
    })
    // ctx.log.info(attributes)
    // ctx.log.info(metadata)
    return metadata
}