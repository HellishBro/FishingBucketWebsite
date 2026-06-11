<svelte:head>
	<title>Copyright | Fishing Bucket</title>
	<meta name="description" content="Copyright and licensing information for Fishing Bucket" />
</svelte:head>

<div class="legal-page">
	<div class="page-header">
		<h1>Copyright</h1>
		<p class="last-updated">© 2026 Sarah Tempest & Contributors</p>
	</div>

	<div class="content-sections">
		<section class="content-section">
			<h2>Fishing Bucket License</h2>
			<p>
				The source code for these services is copyrighted © 2026 by Sarah Tempest & Contributors under the MIT license:
			</p>
			<div class="license-text">
				<p><strong>MIT License</strong></p>
				<p>Copyright (c) 2026 Sarah Tempest & Contributors</p>
				<p>
					Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
					documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
					rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
					persons to whom the Software is furnished to do so, subject to the following conditions:
				</p>
				<p>
					The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
				</p>
				<p>
					THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
					WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
					COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
					OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
				</p>
			</div>
		</section>

		<section class="content-section">
			<h2>Attributions</h2>
			<ul>
				<li>The icon and logo for Fishing Bucket is by JoltGanda, used with permission</li>
				<li>The color scheme of this website is consistent with that of Fluxer's dark theme, used with permission</li>
			</ul>
		</section>

		<section class="content-section">
			<h2>Exceptions</h2>
			<p>
				The following assets are not open-sourced and <strong>may not be copied</strong> without explicit permission from the author(s),
				as they are not intellectual properties of Fishing Bucket, but are of their respective authors:
			</p>
			<ul>
				<li>The icon and logo for Fishing Bucket</li>
				<li>Operation secrets and configurations</li>
				<li>Legal pages, wordmark, and specific brand-specific pages</li>
			</ul>
		</section>
	</div>
</div>

<style>
	.legal-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.last-updated {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
	}

	.content-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.content-section {
		background-color: var(--background-secondary);
		padding: 2rem;
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.content-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.content-section p {
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.license-text {
		background-color: var(--background-tertiary);
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid var(--accent-primary);
		margin: 1rem 0;
	}

	.license-text p {
		margin-bottom: 0.75rem;
	}

	.content-section ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.content-section li {
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 768px) {
		.page-header {
			padding: 1.5rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.content-section {
			padding: 1.5rem;
		}

		.content-section h2 {
			font-size: 1.25rem;
		}
	}
</style>

