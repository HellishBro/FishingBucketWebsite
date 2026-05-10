const shake_animation = [
	{
		transform: "translateX(0)"
	}
].concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => {
	return {
		transform: `translateX(${x % 2 * 5 * (10 - x) / 10}px)`,
		offset: x / 10
	};
})).concat({
	transform: "translateX(0)"
});

export function shake(element: HTMLElement) {
	element.animate(shake_animation, 750);
}