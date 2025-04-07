<div class="k-contentviewfield">
  <div class="k-contentview-container">
    <?= $field->formattedContent() ?>
  </div>
</div>

<style>
.k-contentview-field {
  position: relative;
}

.k-contentview-container {
  font-size: var(--text-base);
  line-height: 1.5;
  padding: .75rem 1rem;
  background: var(--color-gray-100);
  border-radius: var(--rounded);
  overflow-x: auto;
  white-space: pre-wrap;
}

.k-contentview-container p:first-child {
  margin-top: 0;
}

.k-contentview-container p:last-child {
  margin-bottom: 0;
}
</style>