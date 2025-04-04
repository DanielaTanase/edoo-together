/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard-scss'],
	rules: {
		'rule-empty-line-before': null,
		'at-rule-empty-line-before': null,
		'no-descending-specificity': null,
		'declaration-empty-line-before': null,
		'declaration-block-no-redundant-longhand-properties': null,
		'selector-pseudo-element-colon-notation': null,
		'selector-no-vendor-prefix': null,
		'property-no-vendor-prefix': null,
		'color-function-notation': null,
		'alpha-value-notation': null,
		'scss/no-global-function-names': null,
		'scss/at-if-no-null': null,
		'scss/dollar-variable-pattern': null,
		'scss/dollar-variable-empty-line-before': null,
		'scss/dollar-variable-colon-space-after': null,
	}
};
