<?php

class Dice {
    protected  $faces;
    protected  $bias;
    protected  $freqs = array();
    
    // Constructor
    public function __construct($faces, $bias) {
        $this->faces = $faces;
        if ($bias) {
            $this->bias = $bias;
        } else {
            $this->bias = 1/$this->faces;
        }
    }
    
    public function cast() {
        if ((rand(0,100)-$this->bias*100)<=0) {
            $res = $this->faces;
        } else {
            $res = rand(1,$this->faces-1);
        }
        $this->freqs[$res]++;
        return $res;
    }
    
    public function getFreq($eyes) {
        $freq = $this->freqs[$eyes];
        if ($freq=="")
            $freq = 0;
        return $freq;
    }
    
    public function getAvgEyes(array $results) {
        $sum = 0;
        foreach ($results as $value) {
            $sum += $value["res"];
        }
        $avg = $sum/sizeof($results);
        return $avg;
    }
}

class PhysicalDice extends Dice {
    protected $material;
    
    function __construct($faces, $bias, $material) {
        parent::__construct($faces, $bias);
        $this->material = $material;
    }
}

?>