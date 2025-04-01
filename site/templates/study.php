<?php snippet('header') ?>

<main>
  <article>
    <header class="study-header">
      <h1><?= $page->title() ?></h1>
      
      <?php
      // Define status badge colors based on the workflow
      $workflowLabels = [
        'draft' => 'Incomplete',
        'review' => 'Ready for Review',
        'upcoming' => 'Upcoming',
        'active' => 'Active',
        'completed' => 'Completed'
      ];
      
      $workflowClasses = [
        'draft' => 'badge-secondary',
        'review' => 'badge-purple',
        'upcoming' => 'badge-blue',
        'active' => 'badge-green',
        'completed' => 'badge-gray'
      ];
      
      $workflow = $page->workflow()->value();
      $workflowLabel = $workflowLabels[$workflow] ?? ucfirst($workflow);
      $workflowClass = $workflowClasses[$workflow] ?? 'badge-default';
      ?>
      
      <div class="study-meta">
        <span class="badge <?= $workflowClass ?>"><?= $workflowLabel ?></span>
        
        <div class="study-dates">
          <span>
            <strong>Start:</strong> <?= $page->startDate()->toDate('F j, Y') ?>
          </span>
          <span>
            <strong>End:</strong> <?= $page->endDate()->toDate('F j, Y') ?>
          </span>
        </div>
      </div>
    </header>
    
    <div class="content">
      <section class="study-overview">
        <h2>Overview</h2>
        <?= $page->overview()->kirbytext() ?>
      </section>
      
      <?php if($page->objectives()->isNotEmpty()): ?>
      <section class="study-objectives">
        <h2>Objectives</h2>
        <ul class="objectives-list">
          <?php foreach($page->objectives()->toStructure() as $objective): ?>
            <li><?= $objective->objective() ?></li>
          <?php endforeach ?>
        </ul>
      </section>
      <?php endif ?>
      
      <?php if($page->category()->isNotEmpty()): ?>
      <section class="study-category">
        <h2>Product Category</h2>
        <p><?= $page->category()->toPage()->title() ?></p>
        
        <?php if($page->storefront()->isNotEmpty()): ?>
        <p>
          <strong>Storefront UI:</strong> 
          <?= $page->storefront()->toPage()->title() ?>
        </p>
        <?php endif ?>
      </section>
      <?php endif ?>
      
      <?php if($workflow === 'completed' && $page->participantCount()->isNotEmpty()): ?>
      <section class="study-results">
        <h2>Results Summary</h2>
        <p>
          <strong>Total Participants:</strong> <?= $page->participantCount() ?>
        </p>
        <?php if($page->averageTime()->isNotEmpty()): ?>
        <p>
          <strong>Average Completion Time:</strong> <?= $page->averageTime() ?>
        </p>
        <?php endif ?>
        
        <?php if($files = $page->downloadReport()->toFiles()): ?>
        <div class="study-reports">
          <h3>Reports</h3>
          <ul>
            <?php foreach($files as $file): ?>
            <li>
              <a href="<?= $file->url() ?>">
                <?= $file->filename() ?>
              </a>
            </li>
            <?php endforeach ?>
          </ul>
        </div>
        <?php endif ?>
      </section>
      <?php endif ?>
    </div>
  </article>
</main>

<?php snippet('footer') ?>