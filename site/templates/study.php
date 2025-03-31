<?php snippet('header') ?>

<main>
  <article>
    <header>
      <h1><?= $page->title() ?></h1>
    </header>
    
    <div class="content">
      <?= $page->overview()->kirbytext() ?>
      
      <?php if($page->objectives()->isNotEmpty()): ?>
      <section>
        <h2>Objectives</h2>
        <ul>
          <?php foreach($page->objectives()->toStructure() as $objective): ?>
            <li><?= $objective->objective() ?></li>
          <?php endforeach ?>
        </ul>
      </section>
      <?php endif ?>
      
      <?php if($page->category()->isNotEmpty()): ?>
      <section>
        <h2>Product Category</h2>
        <p><?= $page->category()->toPage()->title() ?></p>
      </section>
      <?php endif ?>
    </div>
  </article>
</main>

<?php snippet('footer') ?>