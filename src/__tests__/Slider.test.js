import { fireEvent } from '@testing-library/dom'
import { render } from '@testing-library/svelte'
import Slider from '../Slider.svelte'
import Test from './Test.svelte'

describe('Slider', () => {
	beforeAll(() => {
		Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { value: 100 })
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('should trigger change event when value changed', async () => {
		jest.useFakeTimers()
		const mockFn = jest.fn()
		render(Test, {
			value: 10,
			onChange: mockFn
		})

		jest.runAllTimers()

		expect(mockFn).toHaveBeenCalledTimes(1)
		expect(mockFn).toHaveBeenCalledWith(new CustomEvent('change', {
			detail: { current: 20 }
		}))
	})

	it('changes value when mouse clicked', async () => {
		const { getByRole } = render(Slider, { current: 50, max: 100, min: 0, step: 1 })
		const dom = getByRole('slider')

		await fireEvent.mouseDown(dom, {
			clientX: 40
		})

		expect(dom).toHaveAttribute('aria-valuenow', "40")
	})

	it.skip('changes value when dragging', async () => {
		const { getByRole } = render(Slider, { current: 50, max: 100, min: 0, step: 1 })
		const dom = getByRole('slider')


		await fireEvent.mouseDown(dom, {
			clientX: 40
		})

		await fireEvent.mouseMove(document.body, {
			clientX: 100
		})

		await fireEvent.mouseUp(document.body)

		expect(dom).toHaveAttribute('aria-valuenow', "100")
	})

	it('can change value with keyboard event', async () => {
		const { getByRole } = render(App, { current: 50, max: 100, min: 0, step: 10 })
		const dom = getByRole('slider')
		dom.focus()
		await fireEvent.keyDown(dom, { key: 'ArrowLeft' })
		expect(dom).toHaveAttribute('aria-valuenow', "40")
		await fireEvent.keyDown(dom, { key: 'ArrowRight' })
		expect(dom).toHaveAttribute('aria-valuenow', "50")
	})
})