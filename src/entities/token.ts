import invariant from 'tiny-invariant'
import { ChainId } from '../constants'
import { validateAndParseAddress } from '../utils'
import { Currency } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const WETH = {
  [ChainId.FUJI]: new Token(ChainId.FUJI,'0xd00ae08403B9bbb9124bB305C09058E32C39A48c',18,'WETH','Wrapped ETH'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE,'0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',18,'WETH','Wrapped ETH'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON,'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',18,'WMATIC','Wrapped MATIC'),
  [ChainId.AURORA]: new Token(ChainId.AURORA,'0xBBf006Cb7F45b859E56d3681EA58F059fc9BA3a5',18,'ETH','Wrapped ETH') //TODO: Change to WETH mainnet address 0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB
}
