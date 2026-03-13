import { ObjectOrType } from '@itrocks/class-type'
import { decorate }     from '@itrocks/decorator/property'
import { decoratorOf }  from '@itrocks/decorator/property'

const REQUIRED = Symbol('required')

export function Required<T extends object>(value = true)
{
	return decorate<T>(REQUIRED, value)
}

export function requiredOf<T extends object>(target: ObjectOrType<T>, property: keyof T)
{
	return decoratorOf(target, property, REQUIRED, false)
}
